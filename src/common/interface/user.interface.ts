// import { Request } from 'express';
// import { Roles } from '../enum/role.enum';

// export interface CustomRequest extends Request {
//   user?: {
//     id: number;
//     role: Roles;
//     [key: string]: any;
//   };
//   cookies: { [key: string]: string };
// }
import { Request } from 'express';
import { UserEntity } from 'src/modules/user/entity/user.entity';

export interface CustomRequest extends Request {
  body: any;
  user?: any;
}
