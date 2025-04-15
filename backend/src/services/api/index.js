import { docStructModel } from "../../schemas/documentStructure.schema.js";

export const getDocumentStructureHandler = async (req, res) => {
  const foundDocuments = await docStructModel.find({});
  console.log(foundDocuments);
  
  if (!foundDocuments) {
    res.status(400).json({error: 'No document structure found'});
  } 
  else {
    const sentData = {
      data : foundDocuments
    }
    res.send(sentData);
  }
}

// const sentData = {
//   data: {
//     type: 'users',
//     id: foundUser.id,
//     attributes: {
//       name: name,
//       email: email,
//       profile_image: null,
//     }
//   }
// }
// res.send(sentData);