import { CommonProperty } from './CommonProperty';
import { NotificationGroupUser } from './NotificationGroupUser';
import { NotificationGroupMedia } from './NotificationGroupMedia';
import { NotificationMedia } from './NotificationMedia';

export class NotificationGroup extends CommonProperty {

    organizationId: number;

    name: string;

    description: string;

    notificationGroupUser: NotificationGroupUser[];

    notificationGroupMedia: NotificationGroupMedia[];

    notificationMediaList: NotificationMedia[];

    notificationMediaName: string[];

    timeZone: string;
    timeZoneId: number;
}