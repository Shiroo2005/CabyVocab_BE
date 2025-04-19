export class DataWithPagination {
    page: number
    limit: number
    totalElements: number
    totalPages: number
    data: object
  
    constructor({
      data,
      limit,
      page,
      totalElements
    }: {
      page: number
      limit: number
      totalElements: number
      data: object
    }) {
      this.data = data
      this.limit = limit
      this.page = page
      this.totalElements = totalElements
      this.totalPages = Math.ceil(totalElements / limit)
    }
}