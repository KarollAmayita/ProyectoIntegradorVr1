const supabaseMock = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        order: jest.fn(() => ({
          range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
          maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      order: jest.fn(() => ({
        range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
      maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      gte: jest.fn(() => ({ select: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })) })),
    })),
    insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: null, error: null })) })) })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        is: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              select: jest.fn(() => ({
                maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
              })),
            })),
          })),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            select: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
            })),
          })),
        })),
      })),
      neq: jest.fn(() => ({ select: jest.fn(() => Promise.resolve({ data: [], error: null })) })),
    })),
    delete: jest.fn(() => ({ eq: jest.fn(() => Promise.resolve({ data: null, error: null })) })),
    or: jest.fn(() => ({ maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })) })),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: { path: 'test' }, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://test.com/file.png' } })),
      remove: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
};

module.exports = supabaseMock;
