function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // La demande a été faite et le serveur a répondu avec un code d’état qui n’est pas compris dans la plage 2XX.
    errorMsg = error.response.data;
    console.error("Réponse d'erreur", errorMsg);

    // Pour les téléchargements d'images Cloudinary
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
    }
  } else if (error.request) {
    // La demande a été faite, mais aucune réponse n'a été reçue
    errorMsg = error.request;
    console.error("Demande d'erreur", errorMsg);
  } else {
    // Quelque chose d'autre s'est passé en faisant la demande qui a déclenché une erreur
    errorMsg = error.message;
    console.error("Réonse d'erreur", errorMsg);
  }
  displayError(errorMsg);
}

export default catchErrors;
