# 🚀 MemoryLane - Quick Start Guide

Get your Digital Time Capsule Platform up and running in 5 minutes!

---

## ⚡ Quick Setup

### **Backend** (5 minutes)

```bash
cd server

# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env with your values:
# - MONGO_URI: MongoDB connection (get from MongoDB Atlas)
# - Cloudinary credentials
# - Email credentials
# - CLIENT_URL: http://localhost:5173

# 4. Start server
npm run dev
```

**Expected output:**
```
✅ MongoDB connected
⏰ MemoryLane Scheduler initialized
🚀 Server is running on port 5000
```

### **Frontend** (5 minutes)

```bash
cd client

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**Access:** Open `http://localhost:5173` in your browser

---

## 🧪 First Test (10 minutes)

### **1. Create a Capsule**
- Click **+ Create Capsule**
- Fill in details:
  - Title: "Test Capsule"
  - Message: "This is my first memory!"
  - Theme: "Memories"
  - Privacy: "Private"
  - Unlock Date: **Today or Yesterday** (to test unlock immediately)
  - Recipients: your-email@example.com
  - Media: (optional) Upload a photo
- Click **🎁 Create Capsule**

### **2. Check Dashboard**
- See your capsule in the grid
- Notice the countdown timer
- See unlocked status if date has passed

### **3. View Capsule**
- Click **View →** on your capsule
- If unlocked: See message, media, comments section
- If locked: See countdown timer

### **4. Test Unlock** (if date hasn't passed)
- Wait 1 minute for scheduler to run
- Or manually unlock:
  ```bash
  curl -X POST http://localhost:5000/api/capsules/YOUR_CAPSULE_ID/unlock
  ```
- Refresh page - should show unlocked status

### **5. Test Comments** (if unlocked)
- Scroll to Comments section
- Add a comment
- Add emoji reactions
- See them appear!

---

## 📧 Test Email Notifications

### **Gmail Setup:**
1. Go to myaccount.google.com/apppasswords
2. Generate app password
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=16_char_password
   ```
4. Restart server

### **Test:**
1. Create capsule with today's date
2. Wait ~1 minute (scheduler checks every minute)
3. Check email inbox - should receive notification!
4. Click link to view unlocked capsule

---

## 🎬 Demo Scenario

Try this complete flow:

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev

# Browser: http://localhost:5173
# Create → View → Wait for unlock → Comment → React
```

**Timeline:**
- `T+0min` - Create capsule with today's date
- `T+1min` - Scheduler unlocks it
- `T+2min` - Email received (if configured)
- `T+3min` - View, comment, react!

---

## 🔍 Debugging Tips

### **Server Issues?**
```bash
# Check if server is running
curl http://localhost:5000

# Check MongoDB
# - Verify connection string in .env
# - Check MongoDB Atlas credentials

# Check logs
npm run dev  # See all console logs
```

### **Frontend Issues?**
```bash
# Check if API can be reached
curl http://localhost:5000/api/capsules

# Check browser console (F12)
# - Network tab for API calls
# - Console for JavaScript errors
```

### **Email Issues?**
```bash
# Check .env settings
cat .env | grep EMAIL

# Test credentials
# - Verify app password (not regular password)
# - Check email forwarding isn't blocking

# Check server logs
# Should see: "📧 Email sent to..."
```

---

## 📱 Frontend URLs

| Page | URL |
|------|-----|
| Dashboard | http://localhost:5173/ |
| Create Capsule | http://localhost:5173/create |
| View Capsule | http://localhost:5173/capsule/{id} |

---

## 🛠️ API Quick Reference

```bash
# Create capsule
curl -X POST http://localhost:5000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{"title":"My Capsule", "message":"Test", "theme":"memories", "unlockType":"date", "unlockDate":"2026-12-25", "recipients":["user@example.com"], "createdBy":"me"}'

# Get all capsules
curl http://localhost:5000/api/capsules

# Get one capsule
curl http://localhost:5000/api/capsules/{id}

# Get locked capsules only
curl http://localhost:5000/api/capsules?filter=locked

# Get unlocked capsules only
curl http://localhost:5000/api/capsules?filter=unlocked

# Manually unlock
curl -X POST http://localhost:5000/api/capsules/{id}/unlock

# Check for capsules to unlock
curl -X POST http://localhost:5000/api/capsules/check-unlock

# Add comment
curl -X POST http://localhost:5000/api/capsules/{id}/comments \
  -H "Content-Type: application/json" \
  -d '{"createdBy":"user@example.com", "text":"Great memory!"}'

# Add reaction
curl -X POST http://localhost:5000/api/capsules/{id}/reactions \
  -H "Content-Type: application/json" \
  -d '{"emoji":"❤️", "userId":"user@example.com"}'
```

---

## 🎯 Next Steps

After testing basic functionality:

1. **Set up proper authentication** (optional)
   - Add JWT tokens
   - Protect endpoints with middleware
   - User registration/login

2. **Configure production Cloudinary**
   - Set upload limits
   - Configure transformation rules

3. **Set up production database**
   - Use MongoDB Atlas
   - Add backups

4. **Deploy**
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify

5. **Optional features**
   - AI captions for images
   - Advanced analytics
   - Social sharing

---

## 📚 Full Documentation

See `UPGRADE_GUIDE.md` for:
- Detailed feature list
- Complete file structure
- Troubleshooting
- API endpoints
- Email setup

---

## 💡 Pro Tips

1. **Seed test data:**
   ```bash
   # Create 3 test capsules with different dates
   # Some past (already unlocked)
   # Some future (waiting to unlock)
   ```

2. **Monitor scheduler:**
   ```bash
   # Check logs every minute for "✅ Capsule unlocked"
   npm run dev | grep "Capsule unlocked"
   ```

3. **Test media uploads:**
   - Try different formats: JPG, PNG, MP4, MP3
   - Test with different file sizes
   - Verify Cloudinary limits

4. **Check email deliverability:**
   - Spam folder
   - Email forwarding rules
   - Gmail security settings

---

## 🎉 You're Ready!

Everything is set up. Start creating memories!

```
🎁 Create → ⏳ Wait → 📧 Unlock → 💬 Interact → 📸 Preserve
```

**Enjoy MemoryLane!** 🚀

---

*For detailed help, see UPGRADE_GUIDE.md*
