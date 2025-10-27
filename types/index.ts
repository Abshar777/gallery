export interface IGallery {
    _id: string;
    image:string;
    current:boolean;
    screenId: string;
    currentIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
