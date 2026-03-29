# Job Details Sidebar Layout

## Overview
A right-side panel that displays detailed information about a selected cron job, organized into 4 tabs.

---

## Sidebar Structure

### Header Section
```
┌─────────────────────────────────────────────────┐
│  Cron Job Details                      [✏️] [🗑️] │
│                                                 │
│  Daily Database Backup                          │
│                                                 │
│  🟢 Active              Created: Feb 1, 2025    │
└─────────────────────────────────────────────────┘
```

**Components:**
- **Subtitle**: "Cron Job Details" (small, gray text)
- **Action Buttons**: Edit (✏️) and Delete (🗑️) icons in top right
- **Job Name**: Large, bold title (e.g., "Daily Database Backup")
- **Status Badge**: Left side - colored dot + status text (🟢 Active / 🔴 Inactive / ⚠️ Failed)
- **Created Date**: Right side - "Created: [date]"

---

### Tab Navigation
```
┌─────────────────────────────────────────────────┐
│  [Overview] [Configuration] [Logs] [Stats]      │
└─────────────────────────────────────────────────┘
```

**4 Tabs:**
1. Overview - Quick summary
2. Configuration - Technical settings
3. Logs - Execution history
4. Stats - Analytics & metrics

**Styling:**
- Active tab: Underlined or bold
- Inactive tabs: Gray text
- Smooth transition on switch

---

## Tab 1: Overview 📊

**Purpose:** Quick glance at essential info and actions

```
Schedule
─────────────────────────────────────
Every day at 2:00 AM
Next run: in 3 hours
Timezone: UTC

Performance
─────────────────────────────────────
Success rate: 98.5%
████████████████████░░ 98%
Total executions: 1,245
Average response: 245ms

Quick Actions
─────────────────────────────────────
[▶️ Run Now]  [⏸️ Pause]  [📋 Duplicate]
```

**Sections:**
1. **Schedule**
   - Human-readable schedule (e.g., "Every day at 2:00 AM")
   - Next run time (countdown or datetime)
   - Timezone

2. **Performance**
   - Success rate percentage
   - Visual progress bar
   - Total execution count
   - Average response time

3. **Quick Actions**
   - Run Now button (trigger immediately)
   - Pause/Resume toggle
   - Duplicate button (create copy)

---

## Tab 2: Configuration ⚙️

**Purpose:** Technical details and settings

```
Endpoint
─────────────────────────────────────
URL: https://api.myapp.com/backup
Method: POST
Timeout: 30s
[Copy URL]

Request Details
─────────────────────────────────────
Headers: 2 custom headers
• Authorization: Bearer ***
• Content-Type: application/json

Body: JSON payload (125 bytes)
[View Body]

Advanced Settings
─────────────────────────────────────
Retry: 3 attempts
Retry strategy: Exponential backoff
Notifications: On failure
```

**Sections:**
1. **Endpoint**
   - Full URL
   - HTTP method (GET, POST, etc.)
   - Timeout duration
   - Copy URL button

2. **Request Details**
   - Number of custom headers
   - List of headers (truncate sensitive values)
   - Request body size/type
   - View body button (opens modal)

3. **Advanced Settings**
   - Retry count
   - Retry strategy (exponential backoff, fixed delay)
   - Notification preferences

---

## Tab 3: Logs 📝

**Purpose:** Recent execution history

```
Recent Executions
─────────────────────────────────────

✅ 2 hours ago
   200 OK · 230ms
   Response: {"status": "success"}
   [View Details]

✅ 1 day ago
   200 OK · 250ms
   Response: {"status": "success"}
   [View Details]

❌ 3 days ago
   Timeout · Request failed
   Error: Connection timeout after 30s
   [View Details]

✅ 4 days ago
   200 OK · 240ms
   Response: {"status": "success"}
   [View Details]

[View All Execution History →]
```

**Log Entry Format:**
- Status icon (✅ success / ❌ failed)
- Timestamp (relative: "2 hours ago")
- HTTP status code or error type
- Response time (for successful requests)
- Response preview or error message
- "View Details" button (expands or opens modal)

**Features:**
- Show last 5-10 executions
- Link to full execution history page
- Click to expand for complete details

---

## Tab 4: Stats 📈

**Purpose:** Performance analytics and metrics

```
Performance Metrics
─────────────────────────────────────
Success Rate (Last 30 Days)
98.5%
████████████████████░ 197/200 successful

Response Time
Average: 245ms
Fastest: 120ms
Slowest: 890ms

Execution Stats
─────────────────────────────────────
Total runs: 1,245
This week: 35
This month: 145

Reliability
─────────────────────────────────────
Consecutive successes: 145
Last failure: 3 days ago
Uptime: 99.2%

Mini Chart (Optional)
[Simple line chart showing executions over time]
```

**Sections:**
1. **Performance Metrics**
   - Success rate percentage (last 30 days)
   - Visual progress bar
   - Success/total count

2. **Response Time**
   - Average response time
   - Fastest execution
   - Slowest execution

3. **Execution Stats**
   - Total runs (all time)
   - Runs this week
   - Runs this month

4. **Reliability**
   - Consecutive success streak
   - Last failure timestamp
   - Uptime percentage

5. **Mini Chart** (Optional)
   - Small trend line/bar chart
   - Shows execution frequency over time

---

## Responsive Behavior

### Desktop (>768px)
- Panel width: 400-500px
- Slides in from right
- Backdrop overlay (dims main content)

### Tablet (768px - 1024px)
- Panel width: 60% of screen
- Same slide-in behavior

### Mobile (<768px)
- Full screen takeover
- Slide up from bottom
- Back button in header

---

## Interactions

### Opening Panel
- Click on any job card
- Smooth slide-in animation (300ms)
- Backdrop appears

### Closing Panel
- Click backdrop (outside panel)
- Click X or back button
- Press ESC key
- Smooth slide-out animation

### Tab Switching
- Click tab name
- Smooth content transition
- Maintain scroll position per tab

### Expandable Sections
- Click section headers to collapse/expand
- Save state in localStorage
- Default: All sections expanded

### Copyable Fields
- Click URL to copy
- Show "Copied!" toast notification

---

## Implementation Notes

### State Management
```javascript
const [selectedJob, setSelectedJob] = useState(null);
const [activeTab, setActiveTab] = useState('overview');
const [isPanelOpen, setIsPanelOpen] = useState(false);
```

### Tab Content Component Structure
```javascript
{activeTab === 'overview' && <OverviewTab job={selectedJob} />}
{activeTab === 'configuration' && <ConfigurationTab job={selectedJob} />}
{activeTab === 'logs' && <LogsTab job={selectedJob} />}
{activeTab === 'stats' && <StatsTab job={selectedJob} />}
```

### API Calls Needed
- `GET /api/cron-jobs/{id}` - Fetch job details
- `GET /api/cron-jobs/{id}/executions` - Fetch recent logs
- `GET /api/cron-jobs/{id}/stats` - Fetch statistics
- `POST /api/cron-jobs/{id}/run` - Trigger immediate execution
- `PATCH /api/cron-jobs/{id}` - Update job (pause/resume)
- `DELETE /api/cron-jobs/{id}` - Delete job

---

## Styling Guidelines

### Colors
- **Active status**: Green (#22c55e)
- **Inactive status**: Gray (#6b7280)
- **Failed status**: Red (#ef4444)
- **Background**: White or light gray
- **Borders**: Light gray (#e5e7eb)

### Typography
- **Subtitle**: 12px, gray, uppercase
- **Job name**: 24px, bold, dark
- **Section headers**: 14px, semibold
- **Body text**: 14px, regular
- **Labels**: 12px, gray

### Spacing
- **Panel padding**: 24px
- **Section gap**: 24px
- **Element gap**: 12px
- **Tab gap**: 16px

### Shadows
- **Panel shadow**: `0 10px 25px rgba(0,0,0,0.1)`
- **Button shadow**: `0 2px 4px rgba(0,0,0,0.05)`

---

## Example Component Usage

```jsx
<JobDetailsPanel
  job={selectedJob}
  isOpen={isPanelOpen}
  onClose={() => setIsPanelOpen(false)}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

## Features to Implement

### MVP (Must Have)
- ✅ All 4 tabs
- ✅ Header with edit/delete actions
- ✅ Status badge
- ✅ Quick actions in Overview
- ✅ Recent logs (last 5)
- ✅ Basic stats

### Future Enhancements
- Live updates (real-time next run countdown)
- Mini charts/graphs in Stats tab
- Export job configuration
- Advanced filtering in Logs tab
- Copy configuration to clipboard
- Job comparison feature

---

## Testing Checklist

- [ ] Panel opens/closes smoothly
- [ ] All tabs switch correctly
- [ ] Actions (run, pause, delete) work
- [ ] Data loads for each tab
- [ ] Responsive on mobile/tablet
- [ ] Keyboard navigation (ESC to close)
- [ ] Loading states for API calls
- [ ] Error states for failed requests

---

End of layout documentation.
