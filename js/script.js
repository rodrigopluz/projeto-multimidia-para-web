const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");
const playButton = document.getElementById("play");
const playbackIcons = document.querySelectorAll(
	".playback-icons use"
);
const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progress-bar");
const seek = document.getElementById("seek");
const volumeButton = document.getElementById("volume-button");
const volumeIcons = document.querySelectorAll(
	".volume-button use"
);
const volumeMute = document.querySelector(
	'use[href="#volume-mute"]'
);
const volumeLow = document.querySelector(
	'use[href="#volume-low"]'
);
const volumeHigh = document.querySelector(
	'use[href="#volume-high"]'
);
const volume = document.getElementById("volume");
const videoContainer = document.getElementById(
	"video-container"
);

const videoWorks = !!document.createElement("video").canPlayType;
if (videoWorks) {
	video.controls = false;
	videoControls.classList.remove("hidden");
}

const togglePlay = () => {
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}
};

const updatePlayButton = () => {
	playbackIcons.forEach((icon) =>
		icon.classList.toggle("hidden")
	);
};

const formatTime = (timeInSeconds) => {
	const result = new Date(timeInSeconds * 1000)
		.toISOString()
		.substr(11, 8);

	return {
		minutes: result.substr(3, 2),
		seconds: result.substr(6, 2),
	};
};

const initializeVideo = () => {
	const videoDuration = Math.round(video.duration);
	seek.setAttribute("max", videoDuration);
	progressBar.setAttribute("max", videoDuration);
	const time = formatTime(videoDuration);
	duration.innerText = `${time.minutes}:${time.seconds}`;
	duration.setAttribute(
		"datetime",
		`${time.minutes}m ${time.seconds}s`
	);
};

const updateTimeElapsed = () => {
	const time = formatTime(Math.round(video.currentTime));
	timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
	timeElapsed.setAttribute(
		"datetime",
		`${time.minutes}m ${time.seconds}s`
	);
};

const updateProgress = () => {
	seek.value = Math.floor(video.currentTime);
	progressBar.value = Math.floor(video.currentTime);
};

const timeTooltip = (event) => {
	const skipTo = Math.round(
		(event.offsetX / event.target.clientWidth) *
			parseInt(event.target.getAttribute("max"), 10)
	);

	seek.setAttribute("data-seek", skipTo);
	const t = formatTime(skipTo);
	seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
	const rect = video.getBoundingClientRect();
	seekTooltip.style.left = `${event.pageX - rect.left}px`;
};

const scrollVideo = (event) => {
	const skipTo = event.target.dataset.seek
		? event.target.dataset.seek
		: event.target.value;
	video.currentTime = skipTo;
	progressBar.value = skipTo;
	seek.value = skipTo;
};

const updateVolume = () => {
	if (video.muted) {
		video.muted = false;
	}

	video.volume = volume.value;
};

const updateVolumeIcon = () => {
	volumeIcons.forEach((icon) => {
		icon.classList.add("hidden");
	});

	if (video.muted || video.volume === 0) {
		volumeMute.classList.remove("hidden");
	} else if (video.volume > 0 && video.volume <= 0.5) {
		volumeLow.classList.remove("hidden");
	} else {
		volumeHigh.classList.remove("hidden");
	}
};

const clickMute = () => {
	video.muted = !video.muted;

	if (video.muted) {
		volume.setAttribute("data-volume", volume.value);
		volume.value = 0;
	} else {
		volume.value = volume.dataset.volume;
	}
};

const showControls = () => {
	videoControls.classList.remove("hide");
};

playButton.addEventListener("click", togglePlay);
video.addEventListener("play", updatePlayButton);
video.addEventListener("pause", updatePlayButton);
video.addEventListener("loadedmetadata", initializeVideo);
video.addEventListener("timeupdate", updateTimeElapsed);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("volumechange", updateVolumeIcon);
video.addEventListener("click", togglePlay);
video.addEventListener("mouseenter", showControls);
videoControls.addEventListener("mouseenter", showControls);
seek.addEventListener("mousemove", timeTooltip);
seek.addEventListener("input", scrollVideo);
volume.addEventListener("input", updateVolume);

volumeButton.addEventListener("click", clickMute);
