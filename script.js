const API_KEY = 'AIzaSyD46jguYM5U17859fib5yT-n8EKFVX6uRs'; // Replace with your YouTube Data API key.

const videoForm = document.getElementById('video-form');
const videoUrlInput = document.getElementById('video-url');
const channelInfo = document.getElementById('channel-info');
const videoStatsTable = document.getElementById('video-stats');
const videoStatsBody = videoStatsTable.querySelector('tbody');
const carousel = document.getElementById('carousel');

videoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const videoUrl = videoUrlInput.value;

  try {
    const videoId = getVideoIdFromUrl(videoUrl);
    const videoDetails = await fetchVideoDetails(videoId);
    const channelId = videoDetails.items[0].snippet.channelId;

    const channelDetails = await fetchChannelDetails(channelId);
    displayChannelInfo(channelDetails);

    const channelVideos = await fetchChannelVideos(channelId);
    displayVideoStats(channelVideos);
  } catch (error) {
    console.error('Error fetching video/channel details:', error);
  }
});

displayRandomVideos();
function getVideoIdFromUrl(videoUrl) {
    const url = new URL(videoUrl);
    return url.searchParams.get('v');
  }
  
  async function fetchVideoDetails(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${API_KEY}`);
    return await response.json();
  }
  
  async function fetchChannelDetails(channelId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,statistics&key=${API_KEY}`);
    return await response.json();
  }
  
  function displayChannelInfo(channelDetails) {
    const channel = channelDetails.items[0];
    const title = channel.snippet.title;
    const thumbnail = channel.snippet.thumbnails.default.url;
    const subscriberCount = channel.statistics.subscriberCount;
  
    channelInfo.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <h2>${title}</h2>
      <p>Subscribers: ${subscriberCount}</p>
    `;
  }
  async function fetchChannelVideos(channelId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?channelId=${channelId}&maxResults=5&order=date&part=snippet&type=video&key=${API_KEY}`);
    return await response.json();
  }
  
  async function displayVideoStats(channelVideos) {
    videoStatsBody.innerHTML = '';
  
    for (const video of channelVideos.items) {
      const videoId = video.id.videoId;
      const videoDetails = await fetchVideoDetails(videoId);
  
      const snippet = videoDetails.items[0].snippet;
      const statistics = videoDetails.items[0].statistics;
  
      const title = snippet.title;
      const thumbnail = snippet.thumbnails.default.url;
      const views = parseInt(statistics.viewCount);
      const likes = parseInt(statistics.likeCount);
      const likeViewRatio = (likes / views).toFixed(4);
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${thumbnail}" alt="${title}"></td>
        <td>${title}</td>
        <td>${views}</td>
        <td>${likes}</td>
        <td>${likeViewRatio}</td>
      `;
  
      videoStatsBody.appendChild(row);
    }
  }
  async function fetchRandomVideos() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=music&type=video&videoDefinition=high&maxResults=10&key=${API_KEY}`);
    return await response.json();
  }
  
  async function displayRandomVideos() {
    const randomVideos = await fetchRandomVideos();
    const carouselItems = carousel.querySelectorAll('.carousel-item');
  
    for (let i = 0; i < carouselItems.length; i++) {
      const video = randomVideos.items[i];
      const thumbnail = video.snippet.thumbnails.high.url;
  
      carouselItems[i].innerHTML = `
        <img src="${thumbnail}" class="d-block w-100" alt="...">
      `;
    }
  }
      