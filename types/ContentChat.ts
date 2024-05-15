export interface TextContentChat {
    type: 'text';
    text: string;
}

export interface ImageContentChat {
    type: 'image';
    url_image: string;
    meta: ImageMetaContentChat;
}

export interface ImageMetaContentChat {
    width: number;
    height: number;
}

export interface AudioContentChat {
    type: 'audio';
    url_audio: string;
}