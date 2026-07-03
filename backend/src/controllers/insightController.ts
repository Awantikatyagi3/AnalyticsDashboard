import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AnalyticsModel } from '../models/analyticsModel';

export const insightBodySchema = z.object({
  category: z.enum(['census', 'tourism', 'health', 'education', 'finance', 'ev'], {
    errorMap: () => ({
      message: 'Category must be one of: census, tourism, health, education, finance, ev'
    })
  })
});

export class InsightController {
  static async generateInsight(req: AuthenticatedRequest, res: Response) {
    try {
      const { category } = req.body;
      const metrics = await AnalyticsModel.findByCategory(category);

      if (!metrics || metrics.length === 0) {
        return res.status(404).json({ error: `No analytics data found for category: ${category}` });
      }

      // Convert metrics array to a key-value helper object for quick lookup
      const dataMap: { [key: string]: number } = {};
      metrics.forEach((m) => {
        dataMap[m.metricName] = m.metricValue;
      });

      let summaryText = '';
      let takeaways: string[] = [];
      let recommendations: string[] = [];

      switch (category) {
        case 'census': {
          const pop = dataMap['Total Population'] ? (dataMap['Total Population'] / 1e9).toFixed(2) + 'B' : 'N/A';
          const growth = dataMap['Population Growth Rate (%)'] || 'N/A';
          const literacy = dataMap['Literacy Rate (%)'] || 'N/A';
          const urban = dataMap['Urban Population (%)'] || 'N/A';

          summaryText = `Demographic analysis indicates a stabilizing growth pattern with a total population of ${pop}. Urbanization stands at ${urban}%, while general literacy has reached ${literacy}%.`;
          takeaways = [
            `Population growth is moderating at ${growth}% per annum, reflecting effective demographic transition policies.`,
            `An urbanization rate of ${urban}% suggests high migration to urban centers, requiring enhanced city planning and infrastructure.`,
            `The literacy rate of ${literacy}% is progress, but highlights a remaining ${22.3}% gap to full literacy.`
          ];
          recommendations = [
            'Develop smart city infrastructure to accommodate the expanding urban population.',
            'Target adult literacy campaigns in regions showing high rural-to-urban migration.',
            'Strengthen healthcare access to cater to the aging demographic transition.'
          ];
          break;
        }

        case 'tourism': {
          const dom = dataMap['Annual Domestic Tourists (M)'] || 'N/A';
          const forg = dataMap['Annual Foreign Tourists (M)'] || 'N/A';
          const occupancy = dataMap['Hotel Occupancy Rate (%)'] || 'N/A';
          const stay = dataMap['Average Stay Duration (Days)'] || 'N/A';

          summaryText = `The tourism sector is driven strongly by domestic travel with ${dom}M visitors annually. Foreign tourism accounts for ${forg}M arrivals, with hotel occupancy averaging ${occupancy}%.`;
          takeaways = [
            `Domestic tourism dominates the sector, forming the backbone of regional hospitality revenue.`,
            `Average stay duration is ${stay} days, signaling high engagement but offering room for improvement via experiential tourism.`,
            `An occupancy rate of ${occupancy}% indicates healthy capacity utilization, with peak seasons likely exceeding limits.`
          ];
          recommendations = [
            'Promote off-beat destinations to distribute the domestic tourist volume and increase average stay.',
            'Upgrade international airport corridors and simplify e-visa processes to boost the ${forg}M foreign visitor count.',
            'Introduce seasonal incentives to boost hotel occupancy during off-peak periods.'
          ];
          break;
        }

        case 'health': {
          const life = dataMap['Life Expectancy at Birth (Years)'] || 'N/A';
          const infant = dataMap['Infant Mortality Rate (per 1000)'] || 'N/A';
          const maternal = dataMap['Maternal Mortality Ratio (per 100k)'] || 'N/A';
          const outlay = dataMap['Public Health Outlay (% of GDP)'] || 'N/A';

          summaryText = `Public health indicators reflect a life expectancy of ${life} years. Infant mortality is at ${infant} per 1000 births, supported by a public health budget of ${outlay}% of GDP.`;
          takeaways = [
            `At ${outlay}% of GDP, public health outlay remains slightly below global benchmarks but is targeting primary care expansion.`,
            `Maternal mortality is recorded at ${maternal} per 100,000 live births, demanding localized maternal care interventions.`,
            `Life expectancy has reached a milestone of ${life} years due to cleaner water initiatives and vaccination coverage.`
          ];
          recommendations = [
            'Increase public healthcare budget allocation to 2.5% of GDP over the next fiscal cycle.',
            'Deploy targeted maternal and child health tracking systems in remote rural blocks.',
            'Expand telemedicine networks to bridge the rural-urban specialist doctor gap.'
          ];
          break;
        }

        case 'education': {
          const ger = dataMap['Primary School GER (%)'] || 'N/A';
          const ptr = dataMap['Pupil-Teacher Ratio (Primary)'] || 'N/A';
          const youthLit = dataMap['Youth Literacy Rate (15-24) (%)'] || 'N/A';
          const net = dataMap['Schools with Internet Access (%)'] || 'N/A';

          summaryText = `Primary education shows a strong Gross Enrollment Ratio of ${ger}%, and youth literacy is high at ${youthLit}%. However, school digital connectivity is limited to ${net}%.`;
          takeaways = [
            `Primary school enrollment is universal (${ger}%), suggesting successful enrollment drives.`,
            `The Pupil-Teacher Ratio of ${ptr} indicates manageable classroom sizes, though subject-specific teacher deficits persist.`,
            `Digital literacy is constrained, with only ${net}% of schools having internet access, creating a digital divide.`
          ];
          recommendations = [
            'Launch a nationwide digital school program to upgrade internet connectivity in public schools.',
            'Focus on specialized teacher recruitment to optimize local Pupil-Teacher ratios.',
            'Implement vocational training modules in secondary schools to leverage the ${youthLit}% youth literacy rate.'
          ];
          break;
        }

        case 'finance': {
          const gdp = dataMap['GDP Growth Rate (%)'] || 'N/A';
          const deficit = dataMap['Fiscal Deficit (% of GDP)'] || 'N/A';
          const inflation = dataMap['Inflation Rate (CPI) (%)'] || 'N/A';
          const tax = dataMap['Direct Tax Collection Growth (%)'] || 'N/A';

          summaryText = `Economic activity is robust with a GDP growth rate of ${gdp}%. Fiscal deficit is managed at ${deficit}% of GDP, alongside direct tax growth of ${tax}%.`;
          takeaways = [
            `A GDP growth rate of ${gdp}% demonstrates strong macroeconomic resilience amid global headwinds.`,
            `Tax collection growth of ${tax}% highlights compliance improvements and digitizing tax administration.`,
            `CPI Inflation of ${inflation}% is within the central bank's threshold but warrants close supply-side monitoring.`
          ];
          recommendations = [
            'Utilize direct tax revenue surplus to accelerate capital infrastructure investments.',
            'Maintain a phased fiscal consolidation path to bring the fiscal deficit below 5.0% of GDP.',
            'Address domestic supply-chain bottlenecks to contain CPI inflation below ${inflation}%.'
          ];
          break;
        }

        case 'ev': {
          const evs = dataMap['Total Registered EVs'] ? (dataMap['Total Registered EVs']).toLocaleString() : 'N/A';
          const stations = dataMap['Public Charging Stations'] ? (dataMap['Public Charging Stations']).toLocaleString() : 'N/A';
          const share = dataMap['EV Penetration in Two-Wheelers (%)'] || 'N/A';
          const co2 = dataMap['CO2 Emissions Avoided (Metric Tons)'] ? (dataMap['CO2 Emissions Avoided (Metric Tons)']).toLocaleString() : 'N/A';

          summaryText = `The electric vehicle ecosystem has expanded to ${evs} registered vehicles. CO2 emission reduction is estimated at ${co2} tons, supported by ${stations} public chargers.`;
          takeaways = [
            `EV adoption is heavily led by the two-wheeler segment which holds a ${share}% penetration rate.`,
            `Public charging infrastructure stands at ${stations} units, representing a critical bottleneck for highway EV adoption.`,
            `The environmental impact is significant, with ${co2} metric tons of CO2 offset directly attributable to transition.`
          ];
          recommendations = [
            'Create standardized charging protocols and subsidize private operators to build fast chargers.',
            'Offer targeted subsidy frameworks for commercial three-wheeler and passenger fleet operators.',
            'Encourage battery swapping networks to expedite the penetration rate in two-wheelers past ${share}%.'
          ];
          break;
        }
      }

      return res.status(200).json({
        category,
        summary: summaryText,
        keyTakeaways: takeaways,
        recommendations,
        analyzedBy: 'DENA AI Analytics Engine v1.0',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      return res.status(500).json({ error: 'Failed to generate AI-style insight summary' });
    }
  }
}
