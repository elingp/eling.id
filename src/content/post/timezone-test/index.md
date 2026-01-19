---
title: "Testing Timezone Display"
description: "Test page to verify client-side timezone conversion works correctly"
publishDate: "2025-10-24T15:30:00Z"
tags: ["test"]
draft: true
autoUpdateDate: true
---

## Testing Date Display

This is a test post to verify timezone handling.

### Publish Date (DateTime with specific time)

Published at: 2025-10-24T15:30:00Z (3:30 PM UTC)

- Viewers in UTC+0 (London) should see: Oct 24, 2025, 3:30 PM GMT
- Viewers in UTC+8 (Singapore) should see: Oct 24, 2025, 11:30 PM SGT
- Viewers in UTC-5 (New York) should see: Oct 24, 2025, 10:30 AM EST

### Old Post Example

Posts with date-only frontmatter (like `publishDate: "30 Mar 2022"`) are normalized to UTC midnight and displayed as date-only (no timezone shift).

### What to Test

1. **Open this page in your browser**
2. **Check the publish date** - It should show in YOUR local timezone
3. **Hover over the date** - Tooltip should show full timestamp with timezone
4. **Open DevTools** - Try different timezone settings to see the date change
   - In Chrome: DevTools > ⋮ menu > More tools > Sensors > Location (select different cities)
5. **Compare with build date in footer** - Should also show your local timezone

### Expected Behavior

- ✅ All dates automatically convert to viewer's timezone
- ✅ Date formatting follows `siteConfig.date.locale` settings
- ✅ Hover tooltips show full datetime with timezone
- ✅ Works without JavaScript (shows server-rendered fallback)
- ✅ Old posts with date-only show as dates (no time/timezone)

### Debug Info

Check browser console for any date formatting errors.
