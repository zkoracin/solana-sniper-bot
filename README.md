# Solana Memecoin Trading Bot

## Overview
The Solana Memecoin Trading Bot is an automated trading bot designed to trade memecoins on the Raydium exchange. This bot provides a foundational structure for our comprehensive crypto trading journey. For more information about our journey and further development of this script, please follow [this link](https://zigakoracin.com/crypto-journey/).

**Disclaimer:** Use this bot at your own risk. Trading cryptocurrencies can be highly volatile and involves significant risk of loss.

## Features
- **Pool Discovery:** 
  - Automatically discovers new pools on the Raydium exchange based on user-specified time intervals.
  
- **Token Information Retrieval:** 
  - Fetches detailed information about tokens in discovered pools for further evaluation.

- **Wallet Balance Validation:** 
  - Checks for wallet WSOL and SOL balance before running.

- **Token Validation:** 
  - Validates tokens for freeze and mint authority.

- **Automated Trading:** 
  - Buys a specified amount of a token as provided by the user.
  - Sells the entire amount of the token after a user-specified time period, with user-specified buy and sell fees.

- **Dockerized:** 
  - Run the script over a VPN in a Docker container.

- **Note:** 
  - The script doesn't handle errors, as it only represents the base for further development.

## Instalation
1. Move to repository and install packages
```bash
npm install
```
2. Copy .env-example file and add your credentials and setting to .env file
```bash
cp .env-example .env
```
3. Start the script
```bash
npm run start-dev
```
## Start dockerized
Run bot in the docker container over vpn(protonvpn)
1. Copy docker-compose-example.yml and add your credentials
```bash
cp docker-compose-example.yml docker-compose.yml
```
2. Start docker and run docker compose
```bash
docker-compose up
```