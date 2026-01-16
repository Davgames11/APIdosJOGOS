import app, { initializeAdminUser } from "./server.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initializeAdminUser();
  } catch (err) {
    console.error("Erro inicializando usuário admin:", err);
  }

  const server = app.listen(PORT, () => {
    console.log(`🎮 Servidor GameHub rodando na porta ${PORT}`);
    const addr = server.address();
    console.log(`Listening on ${addr.address}:${addr.port}`);
  });

  // manter o processo vivo em ambientes onde o loop de eventos não é mantido
  process.stdin.resume();
})();
