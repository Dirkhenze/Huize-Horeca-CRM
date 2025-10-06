import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { AIInsight } from '../../../lib/types';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

export function TopKansen() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('insight_type', 'top_kansen')
        .order('score', { ascending: false })
        .limit(20);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Top Kansen</h1>
        <p className="text-slate-600">
          AI-gedetecteerde verkoop- en groeikansen voor maximale omzet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 huize-text-primary" />
            <h3 className="font-semibold text-slate-900">Totale kansen</h3>
          </div>
          <p className="text-3xl font-bold huize-text-primary">{insights.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-900">Potentiële waarde</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">€ 145K</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Actienodig</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">
              Geen kansen gevonden. AI analyseert continu voor nieuwe opportuniteiten.
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        insight.status === 'nieuw'
                          ? 'bg-blue-100 text-blue-700'
                          : insight.status === 'bekeken'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {insight.status}
                    </span>
                    <span className="text-sm text-slate-600">
                      Score: <span className="font-semibold">{Math.round(insight.score)}/100</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{insight.title}</h3>
                  <p className="text-slate-600 mb-4">{insight.description}</p>
                  {insight.recommended_action && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">Aanbevolen actie:</p>
                      <p className="text-sm text-blue-800">{insight.recommended_action}</p>
                    </div>
                  )}
                </div>
                <button className="ml-4 px-4 py-2 text-white rounded-lg huize-primary hover:huize-hover transition">
                  Actie ondernemen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
