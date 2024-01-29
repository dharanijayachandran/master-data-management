import { CommonProperty } from './CommonProperty';
import { NotificationGroupMedia } from './NotificationGroupMedia';

export class NotificationGroupMediaEntity extends CommonProperty{
   notificationGroupMediaId:number;

	recipientContact:string;

	recipientContactName:string;

	notificationGroupMedia:NotificationGroupMedia[];
}