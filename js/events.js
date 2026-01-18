// Fetch and display events from Are.na channel
const ARENA_CHANNEL_SLUG = 'events-pocwu1jcpn4';
const ARENA_API_BASE = 'https://api.are.na/v3';

async function fetchEvents() {
  try {
    // Fetch all blocks from the channel
    const response = await fetch(`${ARENA_API_BASE}/channels/${ARENA_CHANNEL_SLUG}/contents?per=100`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const events = parseEvents(data.data);
    displayEvents(events);

  } catch (error) {
    console.error('Error fetching events:', error);
    // Keep hardcoded events on error
  }
}

function parseEvents(blocks) {
  const events = [];

  // Filter for image blocks and parse their metadata
  blocks.forEach(block => {
    if (block.type === 'Image' && block.description) {
      const event = parseEventMetadata(block);
      if (event) {
        events.push(event);
      }
    }
  });

  // Sort events by date (newest first)
  events.sort((a, b) => b.dateObj - a.dateObj);

  return events;
}

function parseEventMetadata(block) {
  // Description is an object with plain, markdown, and html properties
  const description = block.description.plain || block.description.markdown || '';

  // Split by --- to ignore everything after it
  const parts = description.split('---');
  const relevantContent = parts[0];

  // Extract date and time using regex
  const dateMatch = relevantContent.match(/date:\s*(\d{2}\.\d{2}\.\d{4})/);
  const timeMatch = relevantContent.match(/time:\s*([\d:-]+)/);

  if (!dateMatch) {
    return null; // No valid date found
  }

  const dateStr = dateMatch[1];
  const timeStr = timeMatch ? timeMatch[1] : '';

  // Parse date for sorting (convert DD.MM.YYYY to Date object)
  const [day, month, year] = dateStr.split('.');
  const dateObj = new Date(year, month - 1, day);

  // Format date as "Month DD, YYYY"
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

  // Use the block's title
  const title = block.title || '';

  return {
    date: dateStr,
    formattedDate: formattedDate,
    time: timeStr,
    title: title,
    dateObj: dateObj,
    tinyImageUrl: block.image?.small?.src || block.image?.square?.src,
    link: `https://www.are.na/block/${block.id}`
  };
}

function displayEvents(events) {
  const eventsContainer = document.getElementById('events');

  if (!eventsContainer) {
    console.error('Events container not found');
    return;
  }

  // Clear existing events but keep the header
  const header = eventsContainer.querySelector('p');
  eventsContainer.innerHTML = '';
  if (header) {
    eventsContainer.appendChild(header);
    eventsContainer.appendChild(document.createElement('br'));
  }

  // Create event elements
  events.forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.style.display = 'flex';
    eventDiv.style.gap = '10px';
    eventDiv.style.alignItems = 'flex-start';

    // Add tiny image if available
    if (event.tinyImageUrl) {
      const imageLink = document.createElement('a');
      imageLink.href = event.link;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.src = event.tinyImageUrl;
      img.alt = event.title;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.objectFit = 'cover';
      img.style.flexShrink = '0';

      imageLink.appendChild(img);
      eventDiv.appendChild(imageLink);
    }

    // Create text content container
    const textContainer = document.createElement('div');
    textContainer.style.flex = '1';

    // Format the date and time display
    let dateTimeText = event.date;
    if (event.time) {
      dateTimeText += ` at ${event.time}`;
    }

    const datePara = document.createElement('p');
    datePara.textContent = dateTimeText;

    const titlePara = document.createElement('p');
    titlePara.textContent = event.title;

    textContainer.appendChild(datePara);
    if (event.title) {
      textContainer.appendChild(titlePara);
    }

    eventDiv.appendChild(textContainer);
    eventsContainer.appendChild(eventDiv);
  });

  // Create marquee for upcoming events
  createMarquee(events);
}

function createMarquee(events) {
  const now = new Date();
  const upcomingEvents = events.filter(event => event.dateObj >= now);

  if (upcomingEvents.length === 0) {
    return; // Don't show marquee if no upcoming events
  }

  // Check if marquee already exists
  let marquee = document.getElementById('events-marquee');
  if (!marquee) {
    marquee = document.createElement('div');
    marquee.id = 'events-marquee';
    marquee.style.cssText = `
      background: yellow;
      color: #000;
      padding: 5px 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      width: 100%;
      margin: 0 0 5px 0;
      line-height: 1.5;
      height: auto;
      min-height: 35px;
      display: flex;
      align-items: center;
      margin-bottom: -10px;
    `;

    // Pause animation on hover
    marquee.addEventListener('mouseenter', () => {
      const content = marquee.querySelector('div');
      if (content) content.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      const content = marquee.querySelector('div');
      if (content) content.style.animationPlayState = 'running';
    });

    // Insert at the very top of body
    document.body.insertBefore(marquee, document.body.firstChild);
  }

  // Build events list HTML
  let eventsHTML = '';
  upcomingEvents.forEach((event, index) => {
    if (index > 0) {
      eventsHTML += '<span style="margin: 0 30px;"></span>';
    }

    const timeStr = event.time ? ` at ${event.time}` : '';
    const imgHTML = event.tinyImageUrl
      ? `<img src="${event.tinyImageUrl}" alt="${event.title}" style="width: 20px; height: 20px; object-fit: cover; vertical-align: middle; margin-right: 5px;">`
      : '';
    eventsHTML += `${imgHTML}${event.date}${timeStr} - ${event.title}`;
  });

  // Create marquee content with "upcoming:" only once, then duplicate events
  const marqueeContent = document.createElement('div');
  marqueeContent.style.cssText = `
    display: inline-block;
    white-space: nowrap;
    animation: marquee 40s linear infinite;
  `;

  // Create the full marquee text that will scroll continuously
  const marqueeText = `<span style="font-weight: bold;">upcoming:</span> ${eventsHTML}`;

  // Duplicate the content multiple times for seamless loop
  marqueeContent.innerHTML = marqueeText + '<span style="margin: 0 30px;"></span>' + marqueeText + '<span style="margin: 0 30px;"></span>' + marqueeText;

  marquee.innerHTML = '';
  marquee.appendChild(marqueeContent);

  // Add animation if not already in stylesheet
  if (!document.getElementById('marquee-style')) {
    const style = document.createElement('style');
    style.id = 'marquee-style';
    style.textContent = `
      body { margin: 0; padding: 0; }
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.333%); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Load events when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchEvents);
} else {
  fetchEvents();
}
