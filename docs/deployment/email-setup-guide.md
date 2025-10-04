# 📧 Lanka.Digital Email Setup Guide

**Email Configuration for Authentication & Notifications**

## 📋 Current Email Configuration

### **Local Development (Current Setup):**
- ✅ **Email Confirmations**: Enabled (`enable_confirmations = true`)
- ✅ **Email Service**: Supabase built-in (routes to Mailpit)
- ✅ **Mailpit URL**: http://127.0.0.1:54324
- ✅ **Test Emails**: All emails captured in Mailpit

### **How It Works:**
1. **User registers** → Supabase sends confirmation email
2. **Email goes to** → Mailpit (local email catcher)
3. **View emails at** → http://127.0.0.1:54324
4. **Click verification link** → User account activated

---

## 🧪 **Testing Email System:**

### **1. Register a New User:**
```bash
# In your browser at http://localhost:5173
1. Click "Join Free"
2. Enter: test@example.com, username, password
3. Click "Create Account"
```

### **2. Check Mailpit:**
```bash
# Open in browser
http://127.0.0.1:54324

# Should see:
- Subject: "Confirm your email"
- From: Supabase Auth
- Contains verification link
```

### **3. Test Password Reset:**
```bash
# Click "Forgot Password" → Enter email → Check Mailpit
```

---

## 🚀 **Production Email Setup (Future):**

### **SMTP Configuration for Production:**
```toml
# In config.toml for production
[auth.email.smtp]
enabled = true
host = "smtp.sendgrid.net"  # or your SMTP provider
port = 587
user = "apikey"
pass = "env(SENDGRID_API_KEY)"
admin_email = "noreply@lanka.digital"
sender_name = "Lanka.Digital"
```

### **Recommended Email Providers:**
- **SendGrid**: $0-20/month (good for startups)
- **Mailgun**: $0-35/month (developer friendly)
- **AWS SES**: $0-5/month (AWS integration)
- **Resend**: $0-20/month (modern API)

### **Email Templates to Customize:**
- **Confirmation Email**: Welcome and verify account
- **Password Reset**: Secure password recovery
- **Welcome Email**: Lanka.Digital introduction
- **Premium Upgrade**: Subscription confirmation

---

## 📧 **Email Types in Lanka.Digital:**

### **Authentication Emails:**
- ✅ **Account Confirmation**: New user verification
- ✅ **Password Reset**: Secure password recovery
- ✅ **Email Change**: Verify new email address

### **Transactional Emails:**
- ⏳ **Purchase Confirmation**: Order receipts
- ⏳ **Download Links**: Premium content access
- ⏳ **Premium Upgrade**: Subscription notifications

### **Marketing Emails:**
- ⏳ **Weekly Digest**: New content notifications
- ⏳ **Product Updates**: New releases and features
- ⏳ **Community Highlights**: Forum activity

---

## 🔧 **Current Status:**

- ✅ **Local Email Testing**: Working via Mailpit
- ✅ **Email Confirmations**: Enabled for registration
- ✅ **Password Reset**: Functional
- ⏳ **Production SMTP**: Ready for configuration
- ⏳ **Custom Templates**: Ready for implementation

---

**Email system is ready for testing! Try registering a user and check Mailpit at http://127.0.0.1:54324** 📧✨
