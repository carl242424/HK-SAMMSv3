import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const isTabletOrLarger = width > 768;

const useContainerWidth = () => {
  const [containerWidth, setContainerWidth] = useState(width); 

  const onLayout = useCallback((event) => {
    const newWidth = event.nativeEvent.layout.width;
    setContainerWidth(newWidth);
  }, []);

  return [containerWidth, onLayout];
};

const StatsCard = ({ title, value, detail, detailColor, iconName }) => (
  <View style={styles.card}>
    <Ionicons name={iconName} size={28} color="#60a5fa" style={styles.cardIcon} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={[styles.cardDetail, { color: detailColor }]}>
      {detail}
    </Text>
  </View>
);

const GraphPlaceholder = ({ title, height = 200, children, filterMenu = null }) => {
  const [containerWidth, onLayout] = useContainerWidth();
  const innerChartWidth = containerWidth - 32; 

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.name) {
      if (['BarChart', 'PieChart', 'LineChart'].includes(child.type.name) || child.type.name.includes('Chart')) {
        return React.cloneElement(child, {
          width: innerChartWidth,
        });
      }
    }
    return child;
  });

  return (
    <View style={styles.graphContainer} onLayout={onLayout}>
      <Text style={styles.graphTitle}>{title}</Text>
      {filterMenu} 
      <View style={[styles.graphBox, { height: height }]}>
        {childrenWithProps}
      </View>
    </View>
  );
};

const FilterButton = ({ label, isSelected, onPress, color, bgColor }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      isSelected && { backgroundColor: bgColor || '#e5e7eb' },
      { borderColor: color }
    ]}
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, isSelected && { color: color, fontWeight: 'bold' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Dashboard = () => {
  const statsData = [
    { title: 'Total Scholar', value: '100', detail: '+5% This Month', detailColor: 'green', iconName: 'school-outline' },
    { title: 'Present Today', value: '95', detail: '80% Attendance Rate', detailColor: 'green', iconName: 'checkmark-circle-outline' },
    { title: 'Absent Today', value: '5', detail: '20% Absence Rate', detailColor: 'red', iconName: 'close-circle-outline' },
    { title: 'Weekly Average', value: '92%', detail: '+1% From last week', detailColor: 'green', iconName: 'trending-up-outline' },
    { title: 'Monthly Goal', value: '80%', detail: 'Attendance Target: 90%', detailColor: '#60a5fa', iconName: 'target-outline' },
    { title: 'Late Arrivals', value: '3', detail: 'Focus Area', detailColor: 'orange', iconName: 'time-outline' },
    { title: 'This Week', value: '500', detail: 'Total Check-ins', detailColor: 'green', iconName: 'calendar-outline' },
  ];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`, // neutral dark text
  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, 
  barPercentage: 0.7,
  propsForBackgroundLines: {
    stroke: '#e5e7eb',
  },
};
const statusColors = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  
  const toggleMonth = (month) => {
    setSelectedMonth(month);
  };
  
  const isMonthWithHighAbsence = selectedMonth === 'Jan' || selectedMonth === 'Feb';

  // --- RAW DATA DEFINITIONS ---

  // Bar Chart Data (Daily Attendance Counts) - Modified for react-native-chart-kit format
  const getOriginalBarData = () => {
    const defaultData = [
      { day: 'Mon', present: 95, absent: 5, late: 0 }, 
      { day: 'Tue', present: 92, absent: 8, late: 2 }, 
      { day: 'Wed', present: 88, absent: 12, late: 3 }, 
      { day: 'Thu', present: 96, absent: 4, late: 1 }, 
      { day: 'Fri', present: 90, absent: 10, late: 2 }, 
    ];
    
    if (isMonthWithHighAbsence) {
      return defaultData.map(item => ({
        ...item,
        present: Math.max(0, item.present - 10),
        absent: item.absent + 10,
      }));
    }
    return defaultData;
  };
  const originalBarData = getOriginalBarData();

  const getOriginalPieData = () => {
    if (isMonthWithHighAbsence) {
      return [
        { name: 'Present', population: 380, color: 'rgba(52, 199, 89, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'present' },
        { name: 'Absent', population: 100, color: 'rgba(239, 68, 68, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'absent' },
        { name: 'Late', population: 20, color: 'rgba(251, 191, 36, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'late' },
      ];
    }
    return [
      { name: 'Present', population: 450, color: 'rgba(52, 199, 89, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'present' },
      { name: 'Absent', population: 50, color: 'rgba(239, 68, 68, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'absent' },
      { name: 'Late', population: 20, color: 'rgba(251, 191, 36, 0.8)', legendFontColor: '#333', legendFontSize: 12, status: 'late' },
    ];
  };
  const originalPieData = getOriginalPieData();

  const originalLineData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    datasets: [
      {
        data: [85, 90, 92, 88],
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [10, 8, 6, 10],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [5, 2, 2, 2],
        color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Present %', 'Absent %', 'Late %'],
  };

  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [selectedStatusesBar, setSelectedStatusesBar] = useState(['present', 'absent', 'late']);
  const [selectedPieStatuses, setSelectedPieStatuses] = useState(['present', 'absent', 'late']); 
  const [selectedWeeks, setSelectedWeeks] = useState(['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']);
  const [selectedStatusesLine, setSelectedStatusesLine] = useState(['present', 'absent', 'late']);

  const getFilteredData = (originalData, selectedLabels, allLabels) => {
    return allLabels.map((label, i) => selectedLabels.includes(label) ? originalData[i] : null).filter(Boolean);
  };
  
  // Helper to filter Bar Data for react-native-chart-kit (It only supports simple bars, not stacked)
  const filterBarData = () => {
  const filteredDaysData = originalBarData.filter(item => selectedDays.includes(item.day));

  // pick the active status
  const activeStatus = selectedStatusesBar[0] || 'present';

  return {
    labels: filteredDaysData.map(item => item.day),
    datasets: [
      {
        data: filteredDaysData.map(item => item[activeStatus] || 0),
        colors: filteredDaysData.map(() => (opacity = 1) => statusColors[activeStatus]),
      },
    ],
    legend: [activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)],
  };
};
  const filterPieData = () => {
    return originalPieData.filter(item => selectedPieStatuses.includes(item.status));
  };

  const filterLineData = () => {
    const filteredLabels = originalLineData.labels.filter(label => selectedWeeks.includes(label));
    if (filteredLabels.length === 0) return { labels: [], datasets: [], legend: [] };

    const statusMap = { present: 0, absent: 1, late: 2 };
    const filteredDatasets = originalLineData.datasets
      .filter((_, index) => selectedStatusesLine.includes(Object.keys(statusMap)[index]))
      .map(dataset => ({
        ...dataset,
        data: getFilteredData(dataset.data, selectedWeeks, originalLineData.labels),
      }));

    const filteredLegend = originalLineData.legend.filter((_, index) => 
      selectedStatusesLine.includes(Object.keys(statusMap)[index])
    );

    return { labels: filteredLabels, datasets: filteredDatasets, legend: filteredLegend };
  };

  const barChartKitData = filterBarData();
  const filteredPieData = filterPieData();
  const filteredLineData = filterLineData();

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].filter(Boolean)
    );
  };

  const toggleStatusBar = (status) => {
    setSelectedStatusesBar(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const togglePieStatus = (status) => {
    setSelectedPieStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const toggleWeek = (week) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week) 
        : [...prev, week].filter(Boolean)
    );
  };

  const toggleStatusLine = (status) => {
    setSelectedStatusesLine(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status].filter(Boolean)
    );
  };

  const barFilters = (
    <View style={styles.filterMenuContainer}> 
      <View style={styles.filterRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
          <FilterButton
            key={day}
            label={day}
            isSelected={selectedDays.includes(day)}
            onPress={() => toggleDay(day)}
            color="#333"
            bgColor="#f3f4f6"
          />
        ))}
      </View>
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedStatusesBar.includes('present')} onPress={() => toggleStatusBar('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedStatusesBar.includes('absent')} onPress={() => toggleStatusBar('absent')} color="#ef4444" bgColor="#fee2e2" />
        <FilterButton label="Late" isSelected={selectedStatusesBar.includes('late')} onPress={() => toggleStatusBar('late')} color="#f59e0b" bgColor="#fef3c7" />
      </View>
    </View>
  );
  
  const pieFilters = (
    <View style={styles.filterMenuContainer}> 
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedPieStatuses.includes('present')} onPress={() => togglePieStatus('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedPieStatuses.includes('absent')} onPress={() => togglePieStatus('absent')} color="#ef4444" bgColor="#fee2e2" />
        <FilterButton label="Late" isSelected={selectedPieStatuses.includes('late')} onPress={() => togglePieStatus('late')} color="#f59e0b" bgColor="#fef3c7" />
      </View>
    </View>
  );

  const lineFilters = (
    <View style={styles.filterMenuContainer}>
      <View style={styles.filterRow}>
        {originalLineData.labels.map(week => (
          <FilterButton
            key={week}
            label={week}
            isSelected={selectedWeeks.includes(week)}
            onPress={() => toggleWeek(week)}
            color="#333"
            bgColor="#f3f4f6"
          />
        ))}
      </View>
      <View style={styles.filterRow}>
        <FilterButton label="Present" isSelected={selectedStatusesLine.includes('present')} onPress={() => toggleStatusLine('present')} color="#10b981" bgColor="#d1fae5" />
        <FilterButton label="Absent" isSelected={selectedStatusesLine.includes('absent')} onPress={() => toggleStatusLine('absent')} color="#ef4444" bgColor="#fee2e2" />
        <FilterButton label="Late" isSelected={selectedStatusesLine.includes('late')} onPress={() => toggleStatusLine('late')} color="#f59e0b" bgColor="#fef3c7" />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionHeader}>Attendance Overview</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.cardsRow}
      >
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            detail={stat.detail}
            detailColor={stat.detailColor}
            iconName={stat.iconName}
          />
        ))}
      </ScrollView>
      
      <Text style={styles.sectionHeader}>Attendance Trends & Distribution</Text>
      
      <View style={styles.monthPickerContainer}>
        <Text style={styles.monthPickerLabel}>Viewing Data For:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthPickerScroll}>
          {months.map(month => (
            <FilterButton
              key={month}
              label={month}
              isSelected={selectedMonth === month}
              onPress={() => toggleMonth(month)}
              color={selectedMonth === month ? '#fff' : '#333'}
              bgColor={selectedMonth === month ? '#1d4ed8' : '#e5e7eb'}
            />
          ))}
        </ScrollView>
      </View>

     <GraphPlaceholder title={`Daily Attendance Counts (${selectedMonth} | Mon-Fri)`} height={300} filterMenu={barFilters}>
  {barChartKitData.labels.length > 0 ? (
    <>
      <BarChart
  data={barChartKitData}
  width={width - 64}
  height={260}
  fromZero
  showValuesOnTopOfBars   // ✅ built-in prop for labels
  chartConfig={{
    ...chartConfig,
    barPercentage: 0.6,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
    propsForLabels: { fontSize: 12, fontWeight: '600' },
    propsForBackgroundLines: { stroke: '#d1d5db', strokeDasharray: '4' },
  }}
  style={{ marginVertical: 10, borderRadius: 12 }}
  flatColor
  showBarTops={false}
  withCustomBarColorFromData={true}
  renderCustomBarContent={({ x, y, width, height, index, value }) => (
    <View key={index}>
      {/* 🔑 Label above each bar */}
      <Text
        style={{
          position: 'absolute',
          left: x + width / 2 - 15,   // centers better
          top: y - 20,               // sits just above bar
          fontSize: 12,
          fontWeight: '700',
          color: '#111827',
          textAlign: 'center',
          width: 30,                 // ensures text doesn’t cut off
        }}
      >
        {value}
      </Text>

            {/* Rounded Corner Overlay */}
            <View
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                overflow: 'hidden',
              }}
            />
          </View>
        )}
      />

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: statusColors.present }]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: statusColors.absent }]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: statusColors.late }]} />
          <Text style={styles.legendText}>Late</Text>
        </View>
      </View>
    </>
  ) : (
    <Text style={styles.graphLabel}>
      No data selected. Please choose at least one day and one status.
    </Text>
  )}
</GraphPlaceholder>


      
      <View style={styles.splitGraphsContainer}>
        <View>
          <GraphPlaceholder title={`Monthly Distribution (${selectedMonth})`} height={250} filterMenu={pieFilters}>
            {filteredPieData.length > 0 ? (
              <PieChart
                data={filteredPieData}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                center={[isTabletOrLarger ? 50 : 0, 0]}
              />
            ) : (
              <Text style={styles.graphLabel}>No data selected. Please choose at least one status.</Text>
            )}
          </GraphPlaceholder>
        </View>

        <View>
          <GraphPlaceholder title={`Weekly Attendance Rate (${selectedMonth} | Wk 1-4)`} height={280} filterMenu={lineFilters}>
            {filteredLineData.labels.length > 0 ? (
              <LineChart
                data={filteredLineData}
                height={220}
                chartConfig={chartConfig}
                bezier 
                withVerticalLines={false}
                withDots={true}
                showLegend={true}
                withShadow={true} 
              />
            ) : (
              <Text style={styles.graphLabel}>No data selected. Please choose at least one week.</Text>
            )}
          </GraphPlaceholder>
        </View>
      </View>
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  card: {
    width: 160, 
    minHeight: 120,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  cardDetail: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  monthPickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  monthPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  monthPickerScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  graphContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
graphBox: {
  backgroundColor: '#f9fafb', // softer than #eef2ff
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  paddingVertical: 8,
  paddingHorizontal: 8,
  overflow: 'hidden',
},

  graphLabel: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    padding: 20,
  },
  legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: -5,
      marginBottom: 10,
      gap: 20,
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  legendColor: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
  },
  legendText: {
      fontSize: 12,
      color: '#333',
  },
  splitGraphsContainer: {
    flexDirection: 'column', 
    justifyContent: 'space-between',
  },
  filterMenuContainer: { 
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Dashboard;