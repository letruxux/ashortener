# AShortener

```bash
git clone https://github.com/letruxux/ashortener.git
cd ashortener
docker build -t ashortener .
docker run -d -p 3000:3000 -v <empty folder for db here>:/app/db ashortener
```

## TODO

- ratelimiting - priority high
- custom urls - priority medium
- maybe oidc or something - priority low
- some stress testing just because im curious - priority lowest
