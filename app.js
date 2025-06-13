ymaps.ready(init);

let map;
let rocketPlacemark;
let explosionPlacemark;

function init() {
  map = new ymaps.Map("map", {
    center: [55.7558, 37.6176], // Москва по умолчанию
    zoom: 3,
    controls: ['zoomControl', 'typeSelector']
  });

  const launchBtn = document.getElementById('launchBtn');
  const targetSelect = document.getElementById('targetSelect');
  const status = document.getElementById('status');
  const reaction = document.getElementById('reaction');

  launchBtn.addEventListener('click', () => {
    const coordsStr = targetSelect.value;
    const coords = coordsStr.split(',').map(Number);
    status.textContent = 'Статус: Запуск ракеты...';
    reaction.textContent = '';
    launchRocket(coords).then(() => {
      status.textContent = 'Статус: Взрыв произведён!';
      reaction.textContent = generateReaction(coords);
    });
  });
}

function launchRocket(targetCoords) {
  return new Promise((resolve) => {
    if (rocketPlacemark) {
      map.geoObjects.remove(rocketPlacemark);
    }
    if (explosionPlacemark) {
      map.geoObjects.remove(explosionPlacemark);
    }
    let startCoords = [55.7558, 37.6176]; // старт - Москва
    rocketPlacemark = new ymaps.Placemark(startCoords, {iconCaption: '🚀'}, {
      preset: 'islands#redIcon'
    });
    map.geoObjects.add(rocketPlacemark);

    let steps = 50;
    let step = 0;

    let interval = setInterval(() => {
      step++;
      let lat = startCoords[0] + (targetCoords[0] - startCoords[0]) * (step / steps);
      let lon = startCoords[1] + (targetCoords[1] - startCoords[1]) * (step / steps);
      rocketPlacemark.geometry.setCoordinates([lat, lon]);
      if (step >= steps) {
        clearInterval(interval);
        map.geoObjects.remove(rocketPlacemark);
        explosionPlacemark = new ymaps.Placemark(targetCoords, {
          balloonContent: '💥 Ядерный взрыв!'
        }, {
          preset: 'islands#redCircleDotIcon'
        });
        map.geoObjects.add(explosionPlacemark);
        resolve();
      }
    }, 60);
  });
}

function generateReaction(coords) {
  // Простейшая реакция на основе координат
  const reactions = {
    '55.7558,37.6176': 'Москва в шоке! Люди бегут в укрытия.',
    '38.9072,-77.0369': 'Вашингтон поражён! СМИ кричат о катастрофе.',
    '51.5074,-0.1278': 'Лондон встревожен, власти вводят чрезвычайное положение.',
    '35.6895,139.6917': 'Токио в тревоге, граждане ищут убежища.'
  };
  const key = coords.join(',');
  return reactions[key] || 'Мир потрясён событием.';
}
