npm i --save uuid @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/exporter-trace-otlp-proto @opentelemetry/api


## Executando com o coletor em Docker
docker pull otel/opentelemetry-collector:0.63.0

export OTEL_EXPORTER_OTLP_ENDPOINT=OTLP_ENDPOINT_HERE
export NEW_RELIC_LICENSE_KEY=YOUR_KEY_HERE

docker run --rm \
  -e OTEL_EXPORTER_OTLP_ENDPOINT \
  -e NEW_RELIC_LICENSE_KEY \
  -p 4317:4317 \
  -v "${PWD}/otel-config.yaml":/otel-config.yaml \
  --name otelcol \
  otel/opentelemetry-collector \
  --config otel-config.yaml

