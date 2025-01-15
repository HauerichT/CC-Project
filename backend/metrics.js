const client = require("prom-client");

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "file_storage_service",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a Histogram metric
const latencyHistogram = new client.Histogram({
  name: "operation_latency_seconds",
  help: "Latency of operations in seconds",
  labelNames: ["operation"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Create a Counter metric
const availabilityCounter = new client.Counter({
  name: "operation_availability_total",
  help: "Total number of operations",
  labelNames: ["operation", "status"],
});

// Register the metrics
register.registerMetric(latencyHistogram);
register.registerMetric(availabilityCounter);

module.exports = {
  register,
  latencyHistogram,
  availabilityCounter,
};
