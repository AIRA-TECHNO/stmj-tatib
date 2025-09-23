

declare global {
    interface typeUserAuthed {
        id?: number;
        email?: string;
        username?: string;
        name?: string;
        created_at?: number;
        updated_at?: number;
    }
    type typeMenuApps = Array<{
        href?: string;
        label?: string;
        icon?: ReactNode;
        backroundColor?: string;
        isHeaderItem?: boolean;
        isSidebarItem?: boolean;
        type?: 'general' | 'personal';
        checkIsActive?: (pathNames: string[]) => boolean;
        others?: any;
    }>;
}

export { };