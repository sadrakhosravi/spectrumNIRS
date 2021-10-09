import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';

const recentExperimentsIPCQuery =
  (): BaseQueryFn => async (numOfRecentExperiments: number) => {
    try {
      const recentExperiments = await window.api.getRecentExperiments(
        numOfRecentExperiments
      );
      return { data: recentExperiments };
    } catch (error) {
      return { error };
    }
  };

export const experimentsApi = createApi({
  reducerPath: 'recentExperiments',
  baseQuery: recentExperimentsIPCQuery(),
  endpoints: (build) => ({
    getRecentExperiments: build.query({
      query: (numOfExp) => numOfExp,
    }),
  }),
});

export const { useGetRecentExperimentsQuery } = experimentsApi;
