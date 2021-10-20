import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { ExperimentChannels } from 'utils/channels';

const experimentQuery = (): BaseQueryFn => async (limit: number) => {
  try {
    const recentExperiments = await window.api.invokeIPC(
      ExperimentChannels.getRecentExperiments,
      limit
    );
    return { data: recentExperiments };
  } catch (error) {
    return { error };
  }
};

export const experimentsApi = createApi({
  reducerPath: 'recentExperiments',
  baseQuery: experimentQuery(),
  endpoints: (build) => ({
    getRecentExperiments: build.query({
      query: (limit) => limit,
    }),
  }),
});

export const { useGetRecentExperimentsQuery } = experimentsApi;
