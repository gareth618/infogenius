import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faClipboard as faClipboardOne } from '@fortawesome/free-regular-svg-icons';
import { faClipboard as faClipboardTwo } from '@fortawesome/free-solid-svg-icons';

import {
  faHandPointUp, faSearch, faTimes, faSun, faMoon,
  faAngleDoubleLeft, faAngleDoubleRight, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebookF, faGoogle,
  faGithub, faFacebook, faYoutube, faTwitter
} from '@fortawesome/free-brands-svg-icons';

export function ClipboardOne() { return <FontAwesomeIcon className="fa"    icon={faClipboardOne    } />; };
export function ClipboardTwo() { return <FontAwesomeIcon className="far"   icon={faClipboardTwo    } />; };
export function Scroll      () { return <FontAwesomeIcon className="fa-fw" icon={faHandPointUp     } />; };
export function Search      () { return <FontAwesomeIcon className="fa-fw" icon={faSearch          } />; };
export function Close       () { return <FontAwesomeIcon className="fa-fw" icon={faTimes           } />; };
export function Light       () { return <FontAwesomeIcon className="fa-fw" icon={faSun             } />; };
export function Dark        () { return <FontAwesomeIcon className="fa-fw" icon={faMoon            } />; };
export function Old         () { return <FontAwesomeIcon className="fa"    icon={faAngleDoubleLeft } />; };
export function New         () { return <FontAwesomeIcon className="fa"    icon={faAngleDoubleRight} />; };
export function Send        () { return <FontAwesomeIcon className="fa"    icon={faPaperPlane      } />; };
export function Share       () { return <FontAwesomeIcon className="fa"    icon={faFacebookF       } />; };
export function SignIn      () { return <FontAwesomeIcon className="fa"    icon={faGoogle          } />; };
export function GitHub      () { return <FontAwesomeIcon className="fa"    icon={faGithub          } />; };
export function FaceBook    () { return <FontAwesomeIcon className="fa"    icon={faFacebook        } />; };
export function YouTube     () { return <FontAwesomeIcon className="fa"    icon={faYoutube         } />; };
export function Twitter     () { return <FontAwesomeIcon className="fa"    icon={faTwitter         } />; };
