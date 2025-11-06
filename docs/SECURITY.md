# Security Guide

This document outlines the security features implemented in Fritz Automation and best practices for deployment.

## Implemented Security Features

### 1. Rate Limiting

**Contact Form**: Limited to 5 submissions per hour per IP address to prevent spam.

**Authentication Endpoints** (login/register): Limited to 10 attempts per hour per IP address to prevent brute force attacks.

**General API**: Anonymous users limited to 100 requests/hour, authenticated users to 1000 requests/hour.

### 2. HTTPS & Transport Security

- **SECURE_SSL_REDIRECT**: Forces all HTTP requests to redirect to HTTPS in production
- **HSTS (HTTP Strict Transport Security)**: Instructs browsers to only use HTTPS for 1 year
- **SECURE_PROXY_SSL_HEADER**: Properly handles SSL termination behind reverse proxies

### 3. Cookie Security

- **SESSION_COOKIE_SECURE**: Session cookies only sent over HTTPS
- **SESSION_COOKIE_HTTPONLY**: Prevents JavaScript access to session cookies
- **SESSION_COOKIE_SAMESITE**: Set to 'Lax' to prevent CSRF attacks
- **CSRF_COOKIE_SECURE**: CSRF cookies only sent over HTTPS
- **CSRF_COOKIE_HTTPONLY**: Prevents JavaScript access to CSRF tokens

### 4. Content Security

- **SECURE_CONTENT_TYPE_NOSNIFF**: Prevents MIME type sniffing
- **SECURE_BROWSER_XSS_FILTER**: Enables browser's XSS filtering
- **X_FRAME_OPTIONS**: Set to 'DENY' to prevent clickjacking
- **SECURE_REFERRER_POLICY**: Controls referrer information sent with requests

### 5. CORS (Cross-Origin Resource Sharing)

- Configured to only allow requests from trusted domains
- Credentials are allowed for authenticated requests
- Must be configured per environment (.env file)

### 6. CSRF Protection

- Django's built-in CSRF protection is enabled
- Trusted origins must be explicitly configured
- Token-based authentication for API endpoints

### 7. Input Validation

- Django REST Framework serializers validate all input data
- Email addresses are validated with Django's EmailField
- Phone numbers are validated with Django's PhoneNumberField
- All user inputs are sanitized before database storage

### 8. Email Security

- Emails sent via authenticated SMTP connection
- TLS encryption enabled by default
- Email addresses validated before sending

## Production Deployment Checklist

### Environment Variables

Create a `.env` file based on `.env.example` and configure:

```bash
# CRITICAL: Change these for production
SECRET_KEY=<generate-a-strong-random-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Enable HTTPS security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Configure allowed origins
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Generate Secret Key

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Database Security

1. Use PostgreSQL in production (not SQLite)
2. Use strong database passwords
3. Enable SSL connections to database
4. Regularly backup your database
5. Restrict database access to application server only

### Server Configuration

1. **Use HTTPS**: Obtain SSL/TLS certificate (Let's Encrypt is free)
2. **Keep Software Updated**: Regularly update Django, dependencies, and OS
3. **Use a Firewall**: Only expose necessary ports (80, 443)
4. **Enable Logging**: Monitor access logs and error logs
5. **Regular Backups**: Automated daily backups of database and media files

### Django Settings for Production

Ensure these settings are properly configured:

- `DEBUG = False`
- `SECRET_KEY` is unique and kept secret
- `ALLOWED_HOSTS` includes your domain(s)
- Static files are collected: `python manage.py collectstatic`
- Database migrations are applied: `python manage.py migrate`

## Security Best Practices

### For Administrators

1. **Strong Passwords**: Use complex passwords for admin accounts
2. **2FA**: Enable two-factor authentication for admin panel
3. **Regular Updates**: Keep all dependencies up to date
4. **Monitor Logs**: Regularly review access and error logs
5. **Backup Strategy**: Maintain regular, tested backups

### For Developers

1. **Never Commit Secrets**: Use `.env` files, never commit passwords/keys
2. **Validate Input**: Always validate and sanitize user input
3. **Use ORM**: Use Django's ORM to prevent SQL injection
4. **Escape Output**: Use Django templates to prevent XSS
5. **Review Code**: Conduct security reviews before deployment

## Incident Response

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: forward@fritzautomation.dev
3. Include detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## Security Updates

- Check Django security releases: https://www.djangoproject.com/weblog/
- Update dependencies regularly: `pip list --outdated`
- Subscribe to security mailing lists for your dependencies

## Additional Resources

- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)

## Testing Security

Test your deployment security:

```bash
# Check for common security issues
python manage.py check --deploy

# Test rate limiting
curl -X POST http://localhost:8000/api/contact/ # Run multiple times

# Verify HTTPS redirect (in production)
curl -I http://yourdomain.com
```

---

Last Updated: November 2025
