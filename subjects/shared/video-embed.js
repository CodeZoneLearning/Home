document.querySelectorAll('[data-youtube-video]').forEach((video) => {
  const stage = video.querySelector('[data-video-stage]');
  const playButton = video.querySelector('[data-video-play]');
  const status = video.querySelector('[data-video-status]');
  const videoId = video.dataset.youtubeId?.trim() || '';
  const start = Number.parseInt(video.dataset.youtubeStart || '0', 10);
  const validVideoId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);

  if (!stage || !playButton || !validVideoId) {
    video.classList.add('is-planned');
    if (playButton) {
      playButton.disabled = true;
      playButton.textContent = 'Vídeo em produção';
    }
    if (status) status.textContent = 'Adicione o ID do YouTube para publicar esta aula.';
    return;
  }

  video.classList.add('is-ready');
  if (status) status.textContent = 'O player do YouTube será carregado somente após o clique.';

  playButton.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    const parameters = new URLSearchParams({
      autoplay: '1',
      playsinline: '1',
      rel: '0'
    });
    if (Number.isFinite(start) && start > 0) parameters.set('start', String(start));

    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${parameters}`;
    iframe.title = document.documentElement.lang === 'en'
      ? video.dataset.videoTitleEn || video.dataset.videoTitle || 'Code Zone video lesson'
      : video.dataset.videoTitle || 'Aula em vídeo da Code Zone';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    stage.replaceChildren(iframe);
    video.classList.add('is-playing');
  }, { once: true });
});
