# Deployment Guide

This guide covers deploying Tribe Backend to production.

## Pre-deployment Checklist

- [ ] All tests pass: `pytest`
- [ ] Code is linted: `flake8 app/`
- [ ] Code is formatted: `black app/`
- [ ] All dependencies are specified in `requirements.txt`
- [ ] Environment variables are documented
- [ ] Database migrations are up to date
- [ ] CORS origins are configured correctly
- [ ] SECRET_KEY is changed from default
- [ ] DEBUG is set to False
- [ ] Database backups are configured

## Environment Setup

### Production Environment Variables

Create a `.env.production` file with production values:

```env
ENVIRONMENT=production
DEBUG=False
APP_NAME=Tribe Backend
APP_VERSION=0.1.0

# Database (use production database)
DATABASE_URL=postgresql+asyncpg://user:password@prod-db.example.com:5432/tribe_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Security (change these!)
SECRET_KEY=your-secure-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (set specific origins)
CORS_ORIGINS=https://app.tribe.com,https://www.tribe.com
CORS_ALLOW_CREDENTIALS=True

# Email (configure SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@tribe.com

# API
API_V1_STR=/api/v1
PAGINATION_PAGE_SIZE=20
```

## Docker Deployment

### Build Image

```bash
docker build -t tribe-backend:latest .
```

### Run Container

```bash
docker run -d \
  --name tribe-backend \
  -e DATABASE_URL=postgresql+asyncpg://user:password@db:5432/tribe_db \
  -e SECRET_KEY=your-secret-key \
  -p 8000:8000 \
  tribe-backend:latest
```

### Docker Compose Deployment

Use the production docker-compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Heroku Deployment

### 1. Create Heroku App

```bash
heroku create tribe-backend
```

### 2. Add PostgreSQL Add-on

```bash
heroku addons:create heroku-postgresql:standard-0 --app tribe-backend
```

### 3. Set Environment Variables

```bash
heroku config:set -a tribe-backend \
  SECRET_KEY=your-secret-key \
  ENVIRONMENT=production \
  DEBUG=False
```

### 4. Deploy

```bash
git push heroku main
```

### 5. Run Migrations

```bash
heroku run alembic upgrade head --app tribe-backend
```

## AWS Deployment

### Using Elastic Container Service (ECS)

1. **Push Docker image to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
   docker tag tribe-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/tribe-backend:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/tribe-backend:latest
   ```

2. **Create ECS Task Definition**
   - Use the ECR image
   - Configure environment variables
   - Set memory and CPU limits
   - Configure logging

3. **Create ECS Service**
   - Use the task definition
   - Configure load balancer
   - Set desired count
   - Configure auto-scaling

4. **Setup RDS PostgreSQL**
   - Create RDS database
   - Configure security groups
   - Configure backup and maintenance windows

## Kubernetes Deployment

### Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tribe-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tribe-backend
  template:
    metadata:
      labels:
        app: tribe-backend
    spec:
      containers:
      - name: tribe-backend
        image: tribe-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: tribe-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: tribe-secrets
              key: secret-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: tribe-backend-service
spec:
  selector:
    app: tribe-backend
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
```

Deploy with:
```bash
kubectl apply -f deployment.yaml
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.tribe.com;

    ssl_certificate /etc/letsencrypt/live/api.tribe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tribe.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.tribe.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### Application Monitoring

1. **Health Check Endpoint**
   ```bash
   curl https://api.tribe.com/health
   ```

2. **Application Logs**
   - Check logs in production environment
   - Use centralized logging (ELK, Datadog, etc.)

3. **Error Tracking**
   - Integrate Sentry for error tracking
   - Set up alerts for critical errors

### Database Monitoring

- Monitor query performance
- Set up automated backups
- Monitor disk space
- Set up replication for HA

## Performance Optimization

### Gunicorn Configuration

```bash
gunicorn \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --worker-class uvicorn.workers.UvicornWorker \
  --worker-connections 1000 \
  --max-requests 1000 \
  --max-requests-jitter 100 \
  --timeout 30 \
  app.main:app
```

### Database Optimization

1. Add database indexes
2. Use connection pooling
3. Configure query cache
4. Monitor and optimize slow queries

### Caching

- Implement Redis for caching
- Cache API responses
- Implement rate limiting

## Backup and Recovery

### Database Backups

```bash
# Automated daily backups
pg_dump -h localhost -U postgres tribe_db > tribe_backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U postgres tribe_db < tribe_backup_20231215.sql
```

### Disaster Recovery Plan

1. Regular backup testing
2. Document recovery procedures
3. Test failover procedures
4. Maintain offsite backups

## Zero-Downtime Deployment

### Blue-Green Deployment

1. Deploy new version to "green" environment
2. Run database migrations
3. Run smoke tests
4. Switch load balancer to "green"
5. Keep "blue" as fallback

### Rolling Deployment

1. Update replica instances one at a time
2. Run health checks between updates
3. Automatic rollback on failure

## Rollback Procedure

```bash
# Identify bad deployment
git log --oneline

# Rollback to previous version
git revert <commit-hash>

# Or deploy specific tag
docker run -d tribe-backend:v0.1.0

# Run migrations if needed
alembic downgrade -1
```

## Security Hardening

- Keep dependencies updated
- Enable HTTPS only
- Use security headers
- Implement CORS properly
- Use environment variables for secrets
- Enable database encryption
- Regular security audits
- Implement rate limiting

## Compliance

- GDPR compliance for EU users
- Data retention policies
- Privacy policy compliance
- Regular security audits
- Penetration testing

## Support and Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Test connection
psql -h db.example.com -U user -d tribe_db

# Check DATABASE_URL format
# postgresql+asyncpg://user:password@host:5432/dbname
```

**Memory Issues**
- Monitor memory usage
- Adjust worker count
- Increase instance size

**Slow Queries**
- Enable query logging
- Analyze query plans
- Add indexes
- Optimize N+1 queries

For more help, see the README.md and CONTRIBUTING.md files.
