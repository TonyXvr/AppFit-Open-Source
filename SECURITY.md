# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@appfit.dev. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes

## Security Best Practices

### API Key Management

**Never commit API keys to version control.** This project uses environment variables to manage sensitive credentials:

1. **Use `.env.local` for development**: Copy `.env.example` to `.env.local` and add your actual API keys
2. **Set environment variables in production**: Configure your hosting platform with the required environment variables
3. **Rotate keys regularly**: Regularly rotate your API keys and update them in your environment

### Supabase Security

When using Supabase:

1. **Use Row Level Security (RLS)**: Enable RLS policies to ensure users can only access their own data
2. **Never expose service keys**: Only use the anon key in client-side code
3. **Validate JWT tokens**: Ensure proper authentication validation on the server side
4. **Use HTTPS**: Always use HTTPS in production

### AI Provider Security

1. **API Key Scope**: Use API keys with minimal required permissions
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate and sanitize all user inputs before sending to AI providers
4. **Monitor Usage**: Monitor API usage for unusual patterns

### General Security Guidelines

1. **Keep Dependencies Updated**: Regularly update dependencies to patch security vulnerabilities
2. **Use HTTPS**: Always use HTTPS in production environments
3. **Validate Inputs**: Validate and sanitize all user inputs
4. **Implement CORS**: Configure CORS properly for your domain
5. **Use CSP Headers**: Implement Content Security Policy headers

### Environment Variables

Required environment variables that should be kept secure:

- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `SUPABASE_URL`: Supabase project URL (public but should be configured properly)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (public but should be configured properly)
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID (public)
- `CLOUDFLARE_ANALYTICS_TOKEN`: Cloudflare analytics token (should be kept secure)

### Deployment Security

1. **Environment Variables**: Set all required environment variables in your hosting platform
2. **Domain Configuration**: Configure your domain properly in Supabase and other services
3. **SSL/TLS**: Ensure SSL/TLS is properly configured
4. **Access Controls**: Implement proper access controls for your deployment platform

## Security Updates

We will notify users of security updates through:
- GitHub Security Advisories
- Release notes
- Email notifications (if you've subscribed)

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities to us.
