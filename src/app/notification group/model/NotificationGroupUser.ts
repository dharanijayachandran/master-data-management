import { CommonProperty } from './CommonProperty';
import { NotificationGroup } from './NotificationGroup';

export class NotificationGroupUser extends CommonProperty {

    notificationGroupId:number;

    recipientUserId:number;

    recipientUserName:string;

    notificationGroup:NotificationGroup;
}