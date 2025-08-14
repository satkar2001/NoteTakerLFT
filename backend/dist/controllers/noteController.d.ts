import { Request, Response } from 'express';
export declare const createNote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getNotes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getNoteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateNote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteNote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const convertLocalNotes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleFavorite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=noteController.d.ts.map