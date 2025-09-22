import { Builder, QueryBuilder, Raw, sutando, type AnyQueryBuilder } from 'sutando'

type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN'
type Condition = [string, Operator, any]
type FilterGroup = (Condition | 'OR' | FilterGroup)[]

function applyFilters(qb: AnyQueryBuilder, filters: FilterGroup, dateCols?: string[], isOr = false) {
  if (Array.isArray(filters[0])) {
    qb.where((subQb) => {
      filters.forEach((filter, indexFilter) => {
        if (!Array.isArray(filter)) return;
        const prevFilterItem = filters[indexFilter - 1] ?? '';
        applyFilters(
          subQb, filter, dateCols,
          (typeof prevFilterItem == 'string' && String(prevFilterItem).toUpperCase() == "OR")
        )
      });
    });
  } else {
    const [col, operator, value] = filters as Condition;
    if (dateCols?.includes(col)) {
      const date = new Date(value);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(24, 0, 0, 0));
      qb[isOr ? 'orWhere' : 'where']((subQb) => subQb.where(col, '>=', dayStart).andWhere(col, '<', dayEnd));
    } else {
      qb[isOr ? 'orWhere' : 'where'](col, operator, value);
    }
  }
}

export async function paginator(
  qb: Builder<any> | QueryBuilder<any>,
  searchParams: URLSearchParams,
  options?: {
    searchableCols?: Array<Raw | string>;
    dateCols?: Array<string>;
  }
) {
  // Init var
  let filters = searchParams.getAll('filters');
  let page = Number(searchParams.get('page'));
  let perPage = Number(searchParams.get('per_page') ?? 50);
  let search = searchParams.get('search');
  let sortings = searchParams.getAll('sortings');


  // Filter -- ?filters=['id','=',2]
  if (filters.length) {
    const filterParseds: FilterGroup = [];
    for (const filter of filters) {
      try {
        filterParseds.push(JSON.parse(filter));
      } catch (error) {
        console.error('Invalid filters format:', error);
      }
    }
    if (filterParseds.flatMap((fp) => fp).length) {
      qb.where((subQb: AnyQueryBuilder) => {
        filterParseds.forEach((filters) => applyFilters(subQb, filters as FilterGroup, options?.dateCols))
      });
    }
  }

  // Search
  if (search && options?.searchableCols) {
    qb.where((subQb: AnyQueryBuilder) => {
      for (const searchableField of (options?.searchableCols ?? [])) {
        subQb.orWhere(searchableField, 'ilike', `%${search}%`)
      }
    })
  }

  // Order By -- ?sortings=name,-age
  if (sortings) {
    sortings.flatMap((s) => {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed == 'string') return [parsed];
        return null;
      } catch {
        return s.split(',');
      }
    }).forEach((field) => {
      if (!field) return;
      const direction = field.startsWith('-') ? 'DESC' : 'ASC';
      const column = field.replace(/^-/, '');
      qb.orderBy(column, direction);
    });
  }

  // Return non pagination
  if (isNaN(perPage)) perPage = 50;
  if (perPage < 1) {
    const data = await qb.get();
    return { data, paginate: { total: data.length, per_page: perPage, page: 1, last_page: 1 } };
  }

  // Pagination
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * perPage;
  const data = await qb.clone().offset(offset).limit(perPage).get();
  let total = Number(data.length ?? 0);
  const qbAny: any = qb.clone();
  try {
    if (qbAny?.model?.connection) {
      const qbTotal: any = sutando.connection(qbAny.model.connection)
      total = Number(await qbTotal.table(qbTotal.raw(`(${qbAny.toSql().sql}) as counter`)).count('*')) || 0;
    } else if (qbAny?.client?.queryBuilder) {
      total = Number((await qbAny.client.queryBuilder().from(qb).count('*').first())?.count) || 0;
    }
  } catch (error) { }

  // Return with pagination
  return {
    data, paginate: {
      total,
      per_page: perPage,
      page,
      last_page: Math.ceil(total / perPage)
    }
  };
}
