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
  const now = new Date();

  events.forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.style.display = 'flex';
    eventDiv.style.gap = '10px';
    eventDiv.style.alignItems = 'flex-start';
    eventDiv.style.color = '#000';

    // Add glow effect for upcoming events
    const isUpcoming = event.dateObj >= now;
    if (isUpcoming) {
      eventDiv.style.padding = '8px';
      eventDiv.style.borderRadius = '4px';
      eventDiv.style.boxShadow = '0 0 8px rgb(255, 200, 0)';
      eventDiv.style.transition = 'background-color 0.3s ease';

      // Add hover effect
      eventDiv.addEventListener('mouseenter', () => {
        eventDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      });

      eventDiv.addEventListener('mouseleave', () => {
        eventDiv.style.backgroundColor = 'transparent';
      });
    }

    // Add tiny image if available
    if (event.tinyImageUrl) {
      const imageLink = document.createElement('a');
      imageLink.href = event.link;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';

      // Prevent hover color change
      imageLink.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.color = '#000';
      });
      imageLink.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.color = '#000';
      });

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
}

// Load events when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchEvents);
} else {
  fetchEvents();
}
