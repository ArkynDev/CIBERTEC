const itens = JSON.parse(sessionStorage.getItem('Selecteds')) || [];
const cart = document.getElementById('cart');

function updateCart() {
    if(itens.length == 0) {
        cart.textContent = 'Carrinho';
    } else {
        cart.textContent = `Carrinho ${itens.length}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sheetDBUrl = 'https://sheetdb.io/api/v1/b543lj5zavhqr';
    const storedDataString  = localStorage.getItem('allGames');
    const gameList = document.getElementById('game-list');

    function fetchData() {
        fetch(sheetDBUrl)
            .then(response => response.json())
            .then(data => {
                const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 1 dia em milissegundos

                // Armazenar os dados no localStorage
                localStorage.setItem('allGames', JSON.stringify({
                    data: data,
                    dataExpiracao: expirationTime
                }));
                console.log('Dados armazenados no localStorage:', data);

                displayGames(data);
            })
            .catch(error => {
                console.error('Erro ao buscar os dados:', error);
            });
    }

    function displayGames(gamesData) {
        gameList.innerHTML = '';

        gamesData.forEach(game => {
            const gameCard = document.createElement('button');
            gameCard.className = 'gameCard';
            gameList.appendChild(gameCard);

            gameCard.addEventListener('click', () => {
                if(!itens.includes(game.Name)) {
                    itens.push(game.Name);
                    sessionStorage.setItem('Selecteds', JSON.stringify(itens));
                    console.log(sessionStorage);
                } else {
                    window.alert('O item já está na lista.');
                }
                updateCart();
            })

            const leftContainer = document.createElement('div');
            leftContainer.className = 'leftContainer';

            const rightContainer = document.createElement('div');
            rightContainer.className = 'rightContainer';

            const gameName = document.createElement('p');
            gameName.textContent = game.Name;
            gameName.className = 'gameName';

            const gameDescription = document.createElement('p');
            gameDescription.textContent = game.description;
            gameDescription.className = 'gameDescription';

            const gameDetails = document.createElement('div');
            gameDetails.className = 'gameDetails';

            const gameDetails1 = document.createElement('div');
            const gameDetails2 = document.createElement('div');
            const gameDetails3 = document.createElement('div');
            
            const gameISO = document.createElement('p');
            if(game.ISO == 'Sim') {
                gameISO.textContent = 'ISO: ' + game.TamanhoISO + 'gb';
            } else {
                gameISO.textContent = '---';
            }

            const gameZSO = document.createElement('p');
            if(game.ZSO == 'Sim') {
                gameZSO.textContent = 'ISO: ' + game.TamanhoISO + 'gb';
            } else {
                gameZSO.textContent = '---';
            }

            const coop = document.createElement('p');
            coop.textContent = 'Coop: ' + game.Coop;

            const versus = document.createElement('p');
            versus.textContent = 'Vesus: ' + game.Versus;

            const maxPlayersContent = document.createElement('div');
            const maxPlayers = document.createElement('p');
            maxPlayers.textContent = 'Jogadores';
            const maxPlayersCount = document.createElement('p');
            maxPlayersCount.textContent = game.MaxPlayers;
            maxPlayersCount.className = 'maxPlayers';

            maxPlayersContent.append(maxPlayers, maxPlayersCount)
            

            gameDetails.append(gameDetails1, gameDetails2, gameDetails3);
            gameDetails1.append(gameISO, gameZSO);
            gameDetails2.append(coop, versus);
            gameDetails3.appendChild(maxPlayersContent);

            const gameCover = document.createElement('img');
            gameCover.src = game.Cover;
            gameCover.alt = game.Name;
            gameCover.className = 'gameCover';

            const releasedate = document.createElement('p');
            releasedate.textContent = game.Release;

            gameCard.append(rightContainer, leftContainer)
            leftContainer.append(gameCover, releasedate);
            rightContainer.append(gameName, gameDescription, gameDetails);
        });
    }

    if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        const now = Date.now();

        displayGames(storedData.data);

        // Verificar se os dados não expiraram
        if (now < storedData.dataExpiracao) {
            console.log('Dados carregados do localStorage:', storedData.data);
            // Utilizar os dados: storedData.data
        } else {
            console.log('Dados expiraram, buscando novos dados...');
            fetchData();
        }
    } else {
        // Dados não existem no localStorage, buscar e armazenar
        fetchData();
    }
});

updateCart();