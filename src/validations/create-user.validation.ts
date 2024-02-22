import { extname } from "path";
import { CreateUserDto } from "../types/user.type";
import imageConfig from "../configs/image.config";

export default function validationCreateUser(createUserDto: CreateUserDto) {
  const { name, email, phone, position_id, photoFile } = createUserDto;
  const fails: any = {};

  // validate name
  const failsName = [];
  if (!name) {
    failsName.push('The name field is required.')
  } else if (name.length < 2) {
    failsName.push('The name must be at least 2 characters.')
  } else if (name.length > 60) {
    failsName.push('The name must be no more than 60 characters.')
  }
  if (failsName.length > 0) {
    fails.name = failsName;
  }

  // validate Email
  const failsEmail = [];
  if (!email) {
    failsEmail.push('The email field is required.')
  }
  const emailRegex = /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+)*[@]{1}[a-zA-Z0-9]+([-_]{1}[a-zA-Z0-9]+)*([.]{1}[a-zA-Z0-9]{2,})+$/;
  if (!emailRegex.test(email)) {
    failsEmail.push('The email must be a valid email address.');
  } else if (email.length < 2) {
    failsEmail.push('The email must be at least 2 characters.')
  } else if (email.length > 100) {
    failsEmail.push('The email must be no more than 60 characters.')
  };
  if (failsEmail.length > 0) {
    fails.email = failsEmail;
  }

  // validate phone
  const failsPhone = [];
  if (!phone) {
    failsPhone.push('The phone field is required.')
  }
  const cleanedPhoneNumber = phone.replace(/[\s\-]/g, '');
  if (!(/^[\+]{0,1}380[0-9]{9}$/.test(cleanedPhoneNumber))) {
    failsPhone.push("Invalid phone number. Phone number should start with +380 and follow by 9 digits.")
  }
  const remainingDigits = cleanedPhoneNumber.slice(4);
  const validPrefixes = ["44", "45", "48", "32", "50", "66", "95", "99", "63", "73", "93", "67", "68", "96", "97", "98", "91", "92", "94"];
  if (!validPrefixes.includes(remainingDigits.slice(0, 2))) {
    failsPhone.push("Invalid prefix. It should be one of: " + validPrefixes.join(', '));
  }
  if (failsPhone.length > 0) {
    fails.phone = failsPhone;
  }

  const failsPositionId = [];
  if (!position_id) {
    failsPositionId.push('The position id field is required.')
  } else if (isNaN(Number(position_id))) {
    failsPositionId.push('The position id must be an integer.')
  } else {
    const positionId = Number(position_id)
    if (positionId < 1) {
      failsPositionId.push('The position id must be greater than or equal to 1.');
    } else if (positionId > 4) {
      failsPositionId.push('The position id must be less than or equal to 4.');
    }
  }
  if (failsPositionId.length > 0) {
    fails.position_id = failsPositionId;
  }

  // validation photo path
  const failsPhoto = [];
  
  if (!photoFile) {
    failsPhoto.push('The photo is required.')
  } else {
    const maxImageSize = imageConfig.image_size_mb * 1024 * 1024;
    const fileExtension = extname(photoFile.originalname!).replace('.', '');
    if (!imageConfig.image_valid_extensions.includes(fileExtension)) {
      failsPhoto.push('Image is invalid.');
    }
    if (maxImageSize < photoFile.size!) {
      failsPhoto.push(`The photo may not be greater than ${imageConfig.image_size_mb} Mbytes.`)
    }
  }
  if (failsPhoto.length > 0) {
    fails.photo = failsPhoto;
  }

  return Object.keys(fails).length > 0 ? fails : undefined;
}