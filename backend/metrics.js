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
  name: "socket_io_latency",
  help: "Latency of operations in seconds",
  labelNames: ["operation"],
  buckets: [10, 50, 100, 500, 1000], // Buckets für Latenz in ms
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
