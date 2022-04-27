let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next");
prev = document.querySelector(".prev");
play = document.querySelector(".play");

getSurahs();
function getSurahs() {
  fetch("https://api.quran.sutanlab.id/surah")
    .then((response) => response.json())
    .then((data) => {
      for (let surah in data.data) {
        surahsContainer.innerHTML += `
                <div> 
                    <p>${data.data[surah].name.long}</p>
                    <p>${data.data[surah].name.transliteration.en}</p>
                </div>
            `;
      }
      // Select All Surahs
      let allSurahs = document.querySelectorAll(".surahs div"),
        AyahAudio,
        AyahText;
      allSurahs.forEach((surahs, index) => {
        surahs.addEventListener("click", () => {
          fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.verses;
              AyahAudio = [];
              AyahText = [];
              verses.forEach((verse) => {
                AyahAudio.push(verse.audio.primary);
                AyahText.push(verse.text.arab);
              });

              let ayahIndex = 0;
              changeAyah(ayahIndex);

              audio.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < AyahAudio.length) {
                  changeAyah(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                  audio.pause();

                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Ayah has been ended",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  isPlaying = true;
                  togglePlay();
                }
              });
              // Hande next and prev
              next.addEventListener("click", () => {
                  ayahIndex < AyahAudio.length - 1 ? ayahIndex++ : ayahIndex = 0;
                  changeAyah(ayahIndex);
              });
              prev.addEventListener('click', () => {
                  ayahIndex == 0 ? ayahIndex = AyahAudio.length - 1 : ayahIndex--;
                  changeAyah(ayahIndex);
              });

              let isPlaying = false;
              togglePlay();
              function togglePlay() {
                if (isPlaying){
                    audio.pause();
                    play.innerHTML = `<i class="fas fa-play"></i>`;
                    isPlaying = false;
                }
                else {
                    audio.play();
                    play.innerHTML = `<i class="fas fa-pause"></i>`;
                    isPlaying = true;
                }
              }
              play.addEventListener('click', togglePlay);

              function changeAyah(index) {
                audio.src = AyahAudio[index];
                ayah.innerHTML = AyahText[index];
              }
            });
        });
      });
    });
}
