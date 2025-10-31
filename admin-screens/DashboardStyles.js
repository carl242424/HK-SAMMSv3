import { StyleSheet, Platform, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    // ... existing styles ...
    
    // --- NEW PREDICTIVE ANALYSIS STYLES ---
    
      predictiveAnalysisContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        ...(Platform.OS === 'web' && {
          boxShadow: '0px 4px 10px rgba(0,0,0,0.15), 0px 0px 4px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease-in-out',
        }),
      },
      analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        marginBottom: 8,
      },
      analysisTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
      },
      analysisSubtitle: {
        fontSize: 12,
        color: '#6b7280',
      },
      
      yearItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      },
      yearItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      yearIcon: {
        marginRight: 10,
        backgroundColor: '#eff6ff', // Light blue background for icon box
        padding: 6,
        borderRadius: 8,
      },
      yearItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
      },
      yearItemData: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
      },
      yearItemBold: {
        fontWeight: '700',
        color: '#1f2937',
      },
    
      trendTagContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 90,
        alignItems: 'center',
      },
      trendTagText: {
        fontSize: 12,
        fontWeight: '700',
      },
      
      keyInsightBox: {
        backgroundColor: '#e0f2fe', // Light blue background (like the image)
        borderRadius: 8,
        padding: 16,
        marginTop: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff', // Darker blue border
      },
      keyInsightText: {
        fontSize: 14,
      color: '#1f2937',
      lineHeight: 20,
      },
      keyInsightBold: {
        fontWeight: 'bold',
        color: '#1e40af', // Deep blue for the bold title
      },
    // --- END NEW PREDICTIVE ANALYSIS STYLES ---
    
    // ... rest of existing styles ...
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
      alignItems: 'center',
      gap: 16,
      paddingVertical: 16,
    },
    
    
      card: {
      width: 180, // wider for more spacing
      minHeight: 130,
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 10, // spacing between cards
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
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
        marginBottom: 20,
        // Note: The previous monthPickerContainer styling is mostly moved to datePickerButton
      },
     datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    
      // 🌙 Shadow (iOS & Android)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    
      // 💻 Web shadow fallback
      ...(Platform.OS === 'web' && {
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
        transition: 'box-shadow 0.2s ease-in-out',
      }),
    },
    
      datePickerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
      },
    graphContainer: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      // 💡 Add border for outline
      borderWidth: 1,
      borderColor: '#e5e7eb',
    
      // 💡 Add strong drop shadow (for both iOS & Android)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    
      // 💡 Add subtle outer glow effect (works nicely on web too)
      ...(Platform.OS === 'web' && {
        boxShadow:
          '0px 4px 10px rgba(0,0,0,0.15), 0px 0px 4px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s ease-in-out',
      }),
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
  flexDirection: Platform.OS === "web" ? "row" : "column",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 20,
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
      
      // --- MODAL STYLES ---
      centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: Platform.OS === 'web' ? 50 : 100, // Position lower on web
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: Math.min(width * 0.9, 400), // Max width for larger screens
        position: 'absolute',
        top: 50, // Position near the button area
      },
      modalHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
      },
      yearRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 10,
      },
      yearButton: {
        width: '20%', // 5 columns
        aspectRatio: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
      },
      yearButtonSelected: {
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
      monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
      monthButton: {
        width: '33.333%', // 3 columns
        aspectRatio: 2, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
      },
      monthButtonSelected: {
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
      dateText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
      },
      dateTextSelected: {
        color: 'white',
        fontWeight: '700',
      },
      closeButton: {
      position: 'absolute',
      top: 10,
      right: 12,
      zIndex: 10,
      borderRadius: 20,
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2, // adds shadow on Android
    },
    closeButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 10,
    },
    chartShadowWrapper: {
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6, // Android shadow
      padding: 8, // optional for spacing around chart
      marginVertical: 6,
    },
    topDepartmentsContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      elevation: 2,
    },
    // --- Enhanced Styles for the New Design ---
    departmentRankCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    departmentRankText: {
      fontWeight: 'bold',
      color: '#1d4ed8',
    },
    consistencyTag: {
      marginLeft: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    consistencyTagText: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    progressBarBackground: {
      height: 6,
      backgroundColor: '#f3f4f6',
      borderRadius: 4,
      marginTop: 6,
      marginRight: 6,
    },
    progressBarFill: {
      height: 6,
      backgroundColor: '#10b981',
      borderRadius: 4,
    },
    excellenceBox: {
      backgroundColor: '#e0f2fe', // Light blue background (matches your theme)
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#007bff', // Blue accent border
    },
    excellenceText: {
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 20,
    },
    excellenceBold: {
      fontWeight: 'bold',
      color: '#1e40af', // Deep blue for the bold title
    },
    
    
    });