import { useState, useCallback, useRef } from 'react';
import type { Prediction } from '../types';

/** Possible states of the model loading process */
export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ClassifierResult {
  /** Current model loading status */
  modelStatus: ModelStatus;
  /** Loading progress message */
  statusMessage: string;
  /** Classify an image element and return predictions */
  classifyImage: (imageElement: HTMLImageElement | HTMLCanvasElement) => Promise<Prediction[]>;
  /** Manually trigger model loading */
  loadModel: () => Promise<void>;
}

export default function useImageClassifier(): ClassifierResult {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('AI model not loaded');
  
  // Use refs to hold the model and mobilenet module to avoid stale closures
  const modelRef = useRef<any>(null);
  const mobilenetModuleRef = useRef<any>(null);

  /**
   * Load the MobileNet model.
   */
  const loadModel = useCallback(async () => {
    if (modelRef.current) {
      setModelStatus('ready');
      setStatusMessage('AI model ready');
      return;
    }

    try {
      setModelStatus('loading');
      setStatusMessage('Loading TensorFlow.js...');

      // Dynamic import so the large library is only loaded when needed
      const tf = await import('@tensorflow/tfjs');
      
      // Set the backend
      await tf.ready();
      
      setStatusMessage('Loading MobileNet model (~16MB)...');
      
      const mobilenet = await import('@tensorflow-models/mobilenet');
      mobilenetModuleRef.current = mobilenet;

      // Load MobileNet v2 with alpha 1.0 for best accuracy
      const loadedModel = await mobilenet.load({
        version: 2,
        alpha: 1.0,
      });

      modelRef.current = loadedModel;
      setModelStatus('ready');
      setStatusMessage('AI model ready');
    } catch (error) {
      console.error('Failed to load MobileNet model:', error);
      setModelStatus('error');
      setStatusMessage('Failed to load AI model');
    }
  }, []);

  /**
   * Classify a single image element.
   * Returns top 5 predictions with class names and probabilities.
   */
  const classifyImage = useCallback(
    async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<Prediction[]> => {
      if (!modelRef.current) {
        throw new Error('Model not loaded');
      }

      try {
        const predictions = await modelRef.current.classify(imageElement, 5);
        return predictions.map((p: any) => ({
          className: p.className,
          probability: p.probability,
        }));
      } catch (error) {
        console.error('Classification error:', error);
        return [];
      }
    },
    []
  );

  return {
    modelStatus,
    statusMessage,
    classifyImage,
    loadModel,
  };
}
