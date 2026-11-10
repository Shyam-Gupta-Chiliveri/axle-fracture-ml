FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt pyproject.toml README.md ./
COPY src ./src
COPY api ./api
COPY scripts ./scripts
COPY configs ./configs
COPY data/fixtures ./data/fixtures
RUN pip install --no-cache-dir -r requirements.txt
COPY models ./models

ENV PYTHONPATH=/app/src:/app
ENV PORT=8080
EXPOSE 8080
CMD ["python", "scripts/serve.py"]
