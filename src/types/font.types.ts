export interface CreateFontDto {
    name: string
    regular: string
    bold: string
    italic: string
}

export interface UpdateFontDto {
    name?: string
    regular?: string
    bold?: string
    italic?: string
}

export interface FontOutDto {
    id: string
    name: string
    regular: string
    bold: string
    italic: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
}
