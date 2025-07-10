
# 🌌 Astro Vocab Backend Project
📚 An educational tool that helps users, especially students, expand and reinforce their English vocabulary through interactive learning.

🧠 This backend manages:

🗂️ Vocabulary data

📈 User progress

❓ Quizzes

🔐 Authentication

🚀 Designed to provide a smooth and scalable experience for the Astro Vocab platform.


## Run Locally

Clone the project

```bash
  git clone git@github.com:Shiroo2005/Astro_Vocab_BE.git
```

Go to the project directory

```bash
  cd Astro_Vocab_BE
```

Create file env.

```bash
    Env section below...
```

Start the server

```bash
    docker compose up
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```env
#SERVER
SERVER_PORT=8081

#DB
DB_USER=dev
DB_PASSWORD=dev1233
DB_PORT=5432
DB_NAME=nestdb
DB_SCHEMA=astro-vocab
DB_HOST=db
DB_URL=postgresql://dev:dev1233@db/nestdb?schema=astro-vocab

#REDIS
REDIS_HOST=redis
REDIS_PORT=6379

#JWT
JWT_SECRET_KEY=sknsk2dwi&29MMS&&^^AnnNI>9
JWT_EMAIL_SECRET_KEY=cdkmacscmslacs929838UAXNKXAN@@@@

#MAIL
RESEND_API_KEY=re_dgTGCpsg_L7kKahscVMwF5R1uQA8uHDVB
FROM_EMAIL=noreply@astrovocab.id.vn

#URL
FE_URL=l

```
