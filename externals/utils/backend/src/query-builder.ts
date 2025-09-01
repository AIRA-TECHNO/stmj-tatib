import type { AnyQueryBuilder } from 'sutando'

type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN'
type Condition = [string, Operator, any]
type FilterGroup = (Condition | 'OR' | FilterGroup)[]

function applyFilters(qb: AnyQueryBuilder, filters: FilterGroup, isOr?: boolean) {
  if (Array.isArray(filters[0])) {
    qb.where((subQb) => {
      filters.forEach((filter, indexFilter) => {
        if (!Array.isArray(filter)) return;
        const prevFilterItem = filters[indexFilter - 1] ?? '';
        applyFilters(
          subQb, filter as FilterGroup,
          Boolean(
            typeof prevFilterItem == 'string' &&
            String(prevFilterItem).toUpperCase() == "OR"
          )
        )
      });
    });
  } else {
    qb[isOr ? 'orWhere' : 'where'](...(filters as Condition));
  }
}

export async function paginate(
  qb: AnyQueryBuilder,
  query: {
    filters?: string;
    page?: number;
    per_page?: number;
    search?: string;
    sortings?: string;
  },
  searchableFields?: string[]
) {
  // Filter
  if (query.filters) {
    try {
      const filters: FilterGroup = JSON.parse(query.filters);
      qb.where((subQb) => {
        applyFilters(subQb, filters)
      })
    } catch (err) {
      console.error('Invalid filters format:', err)
    }
  }

  // Search
  if (query.search && searchableFields) {
    qb.where((subQb) => {
      for (const searchableField of searchableFields) {
        subQb.where(searchableField, 'like', `%${query.search}%`)
      }
    })
  }

  // Order By
  if (query.sortings) {
    let sortings: string[] = [];
    try {
      sortings = JSON.parse(query.sortings)
    } catch (err) {
      sortings = query.sortings.split(',');
    }
    for (let sorting of sortings) {
      let direction: 'ASC' | 'DESC' = 'ASC';
      if (sorting.startsWith('-')) {
        sorting = sorting.substring(1);
        direction = 'DESC';
      }
      qb.orderBy(sorting, direction)
    }
  }

  // Paginate
  let perPage = Number(query.per_page);
  if (isNaN(perPage)) perPage = 10;
  if (perPage < 1) return { data: await qb.get() };

  let page = Number(query.page);
  if (isNaN(page)) page = 1;

  const { data, ...meta } = (await qb.paginate(page, perPage)).toJSON();
  return { data, meta }
}
