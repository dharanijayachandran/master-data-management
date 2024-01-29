import { CommonProperty } from './CommonProperty';
import { NotificationGroupMediaEntity } from './NotificationGroupMediaEntity';
import { NotificationMedia } from './NotificationMedia';

export class NotificationGroupMedia extends CommonProperty {

    notificationGroupId: number;

    notificationMediaId: number;

    notificationMedia: NotificationMedia[];

    notificationGroupMediaEntity: NotificationGroupMediaEntity[];

    notificationMediaName: string;

    isChecked: boolean
}