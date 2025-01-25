import * as tf from '@tensorflow/tfjs';

export class DeliveryPredictor {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Simple neural network for delivery time prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
  }

  async predictDeliveryTime(input: {
    distance: number;
    weight: number;
    trafficLevel: number;
    weatherCondition: number;
    timeOfDay: number;
    priority: number;
  }): Promise<number> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const tensor = tf.tensor2d([
      [
        input.distance,
        input.weight,
        input.trafficLevel,
        input.weatherCondition,
        input.timeOfDay,
        input.priority
      ]
    ]);

    const prediction = await this.model.predict(tensor) as tf.Tensor;
    const result = await prediction.data();
    tensor.dispose();
    prediction.dispose();

    return result[0];
  }
}