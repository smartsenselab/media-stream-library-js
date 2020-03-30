const { pipelines } = window.mediaStreamLibrary

const play = host => {
  // Grab a reference to the video element
  const mediaElement = document.querySelector('video')

  mediaElement.addEventListener('error',function(e){ console.error(e); })

  // Setup a new pipeline
  const pipeline = new pipelines.DvrPipeline({
    ws: { uri: `ws://10.167.232.44:5001/` },
    mediaElement,
  })
}

play(window.location.hostname)
