import HttpService from "./htttp.service";

class UserService {
  getDocumentStructure = async() => {
    const endpoint = 'api/document-structure';
    return await HttpService.get(endpoint);
  }

  getDocumentFields = async(docName) => {
    const endpoint = `api/document-fields/${docName}`;
    return await HttpService.get(endpoint);
  }

  resetPassword = async (credentials) => {
    const resetPassword = 'password-reset';
    return await HttpService.post(resetPassword, credentials);
  }

  updateProfile = async (newInfo) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  }
}

export default new UserService();
