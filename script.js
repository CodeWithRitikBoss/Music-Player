console.log("Let's write JavaScript Code here.")

// This code is used to Right Click eventListener on the body.
let body = document.body
body.addEventListener("contextmenu", () => {
    alert("Don't hack us by Right click please!!")
})

// This will be used to play the current song.
let currentSong = new Audio();
let songs;
let currentFolder;
let defaultSongs;

// This function will fetch the list of songs from the server.
async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`http://192.168.31.33:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href)
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    console.log(songs)

    // Show all songs in the song list.
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" width="34" src="Images/music.svg" alt="musicImage">
                <div class="info">
                    <!-- <div><marquee behavior="" direction="left">${decodeURI(song.replaceAll("%20", " "))}</marquee></div> -->
                    <div>${decodeURI(song.replaceAll("%20", " "))}</div>
                    <div>Ritik Babu</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" width="34" src="Images/playBtn.svg" alt="playButtonImage">
                </div>
            </li>`;
    }

    // Attach an eventlistener to each event.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // This line of code will print current clicked song name.
            e.style.backgroundColor = "#1f1f1f";
            setTimeout(() => {
                e.style.backgroundColor = "#121212";
            }, 500);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            // This line of code will be change Play button image color randmonly inside the song list.
            // e.querySelector(".playNow>img").src = e.querySelector(".playNow>img").src.replace("playBtn.svg", "pauseBtn.svg");
        })
    })
}

async function displayAlbums() {
    let a = await fetch(`http://192.168.31.33:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let allAnchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(allAnchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let songFolderName = e.href.split("/").slice(-2)[0]
            // Get the metadata of the song's Folder.
            let a = await fetch(`http://192.168.31.33:3000/songs/${songFolderName}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${songFolderName}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="/songs/${songFolderName}/cover.jpeg" alt="Image1">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`
        }
    }

    // Load the playlist whenever card is clicked.
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })

}

// This function is to show time duration in this formate (00:00) by taking seconds.
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        // return "Invalid input";
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// This function is ued to generate random colors in light mode. function-1.
function getRandomlightColor() {
    let val1 = Math.ceil(100 + Math.random() * 255);
    let val2 = Math.ceil(100 + Math.random() * 255);
    let val3 = Math.ceil(100 + Math.random() * 255);
    return `rgb(${val1}, ${val2}, ${val3})`
}

// This function is ued to generate random colors in light mode. function-2.
function randomColorGenerator() {
    // Generate a random color in hexadecimal format.
    // return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
}

function changeLogoColorRandmonly() {
    // This code is used to change websiteName color reandomly.
    setInterval(() => {
        document.getElementById("AppBranding").style.color = getRandomlightColor();
    }, 1000)
}

// This function will play the music.
/**
 * Plays the music track.
 * @param {string} track - The name of the track to play.
 */
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track
    console.log("Playing the track: ", currentSong.src)
    if (!pause) {
        currentSong.play()
        play.src = "Images/pauseBtn.svg";
    }
    document.querySelector(".songInfo .mar").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

// This function will be called when the page loads.
async function main() {

    // Change the logo color randomly.
    changeLogoColorRandmonly()

    // Get the list of all songs.
    await getSongs("songs/Punjabi%20Songs");
    for (let index = 0; index < songs.length; index++) {
        console.log(`Song ${index + 1}: ${songs[index]}`);
    }
    console.log("Total Songs: ", songs.length)
    console.log("Playing the first song: ", songs[0])
    playMusic(songs[0], true)

    // Display all the albums on the page.
    await displayAlbums()

    // Attach an event listener to play, pause, next and previous buttons.
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Images/pauseBtn.svg"
        } else {
            currentSong.pause()
            play.src = "Images/playBtn.svg"
        }
    })

    // Attach an event listener to next buttons.
    next.addEventListener("click", () => {
        currentSong.pause()
        // console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        } else {
            // console.log("No more songs to play.")
        }
    })

    // Attach an event listener to previous buttons.
    previous.addEventListener("click", () => {
        currentSong.pause()
        // console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        } else {
            // console.log("No previous song to play.")
        }
    })

    // Add an event listener to volume control.
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add an event listener to mute the track.
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })

    // Listen for time update event.
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        // coding for seekBar
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    })

    // aad an eventListener to seekBar.
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (((currentSong.duration) * percent) / 100)

    })

    // Add an event listener for hamburger Menu.
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button.
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to login button.
    document.querySelector(".loginBtn").addEventListener("click", () => {
        // Create the popup overlay
        let popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.background = "rgba(0,0,0,0.5)";
        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.zIndex = "9999";

        // Create the form container
        let form = document.createElement("div");
        form.style.background = "#222";
        form.style.padding = "32px";
        form.style.borderRadius = "8px";
        form.style.boxShadow = "0 2px 16px rgba(0,0,0,0.3)";
        // form.style.minWidth = "300px";
        form.style.maxWidth = "320px"; // Optionally set a max width for better appearance
        form.innerHTML = `
            <h1 style="color:#fff;margin-bottom:16px;">Login</h1>
            <label style="color:#fff;font-size:15px;">Email</label>
            <input type="email" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <label style="color:#fff;font-size:15px;">Password</label>
            <input type="password" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <div class="login-error" style="color:#f44336;font-size:15px;margin-bottom:10px;min-height:18px;"></div>
            <div style="display:flex;justify-content:space-between;">
                <button type="submit" style="padding:8px 16px;border:none;border-radius:4px;background:#4caf50;color:#fff;cursor:pointer;font-size:15px;">Login</button>
                <button type="button" class="closeLogin" style="padding:8px 16px;border:none;border-radius:4px;background:#f44336;color:#fff;cursor:pointer;font-size:15px;">Cancel</button>
            </div>
        `;

        popup.appendChild(form);
        document.body.appendChild(popup);

        // Close popup on cancel
        form.querySelector(".closeLogin").onclick = () => {
            document.body.removeChild(popup);
        };

        form.querySelector("button[type='submit']").onclick = (e) => {
            e.preventDefault();
            let email = form.querySelector("input[type='email']").value.trim();
            let password = form.querySelector("input[type='password']").value;
            let errorDiv = form.querySelector(".login-error");
            errorDiv.textContent = "";
            let confirm = form.querySelector(".signup-confirm") ? form.querySelector(".signup-confirm").value : "";
            // Validate the form inputs
            if (!email || !password) {
                errorDiv.textContent = "Both email and password are required.";
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                errorDiv.textContent = "Please enter a valid email address.";
                return;
            }
            if (password.length < 6) {
                errorDiv.textContent = "Password must be at least 6 characters.";
                return;
            }

            // You can add your login logic here (e.g., send to server)
            alert(`Login submitted!\nEmail: ${email}`);
            document.body.removeChild(popup);

            // Save email and password to a file (requires backend)
            fetch('save-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            }).then(res => {
                // Optionally handle response
            }).catch(err => {
                // Optionally handle error
            });
        };
    });

    // Add an event listener to signup button.
    document.querySelector(".signupBtn").addEventListener("click", () => {
        // Create the popup overlay
        let popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.background = "rgba(0,0,0,0.5)";
        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.zIndex = "9999";

        // Create the form container
        let form = document.createElement("div");
        form.style.background = "#222";
        form.style.padding = "32px";
        form.style.borderRadius = "8px";
        form.style.boxShadow = "0 2px 16px rgba(0,0,0,0.3)";
        // form.style.minWidth = "120px";
        // form.style.minWidth = "120px"; // Decreased width to half (was 120px)
        form.style.maxWidth = "320px"; // Optionally set a max width for better appearance
        form.innerHTML = `
            <h1 style="color:#fff;margin-bottom:16px;font-size:18px;">Sign Up</h1>
            <label style="color:#fff;font-size:15px;">Full Name</label>
            <input type="text" class="signup-name" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <label style="color:#fff;font-size:15px;">Email</label>
            <input type="email" class="signup-email" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <label style="color:#fff;font-size:15px;">Password</label>
            <input type="password" class="signup-password" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <label style="color:#fff;font-size:15px;">Confirm Password</label>
            <input type="password" class="signup-confirm" style="width:100%;margin-bottom:20px;padding:8px;border-radius:4px;border:none;font-size:15px;background:#666;color:#fff;" required>
            <div class="signup-error" style="color:#f44336;font-size:15px;margin-bottom:10px;min-height:18px;"></div>
            <div style="display:flex;justify-content:space-between;">
                <button type="submit" style="padding:8px 16px;border:none;border-radius:4px;background:#2196f3;color:#fff;cursor:pointer;font-size:15px;">Sign Up</button>
                <button type="button" class="closeSignup" style="padding:8px 16px;border:none;border-radius:4px;background:#f44336;color:#fff;cursor:pointer;font-size:15px;">Cancel</button>
            </div>
        `;

        popup.appendChild(form);
        document.body.appendChild(popup);

        // Close popup on cancel
        form.querySelector(".closeSignup").onclick = () => {
            document.body.removeChild(popup);
        };

        // Handle form submission
        form.querySelector("button[type='submit']").onclick = (e) => {
            e.preventDefault();
            let name = form.querySelector(".signup-name").value.trim();
            let email = form.querySelector(".signup-email").value.trim();
            let password = form.querySelector(".signup-password").value;
            let confirm = form.querySelector(".signup-confirm").value;
            let errorDiv = form.querySelector(".signup-error");
            errorDiv.textContent = "";

            if (!name || !email || !password || !confirm) {
                errorDiv.textContent = "All fields are required.";
                return;
            }
            if (password !== confirm) {
                errorDiv.textContent = "Passwords do not match.";
                return;
            }

            // You can add more validation here
            alert("Signup submitted!");
            document.body.removeChild(popup);
        };
    });

    // Add an event listener to the search icon for handling search functionality.
    document.querySelector(".search-icon").addEventListener("click", () => {
        const searchValue = document.querySelector(".searchBar input").value.trim();
        if (!searchValue) {
            alert("Search value is not valid.");
        } else {
            alert("Under Developing: " + searchValue);
        }
    });
}

// Call the main function to start the application.
main()
