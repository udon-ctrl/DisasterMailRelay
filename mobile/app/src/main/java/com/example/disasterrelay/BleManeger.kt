package com.example.disasterrelay

import android.bluetooth.*
import android.bluetooth.le.*
import android.content.Context
import android.os.ParcelUuid
import android.util.Log
import java.util.*

class BleManager(private val context: Context) {
    private val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val bluetoothAdapter = bluetoothManager.adapter
    private val advertiser = bluetoothAdapter.bluetoothLeAdvertiser
    private val scanner = bluetoothAdapter.bluetoothLeScanner

    private val serviceUUID = UUID.fromString("0000180D-0000-1000-8000-00805F9B34FB")

    fun startAdvertising(data: String) {
        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(true)
            .build()

        val advertiseData = AdvertiseData.Builder()
            .addServiceUuid(ParcelUuid(serviceUUID))
            .addServiceData(ParcelUuid(serviceUUID), data.toByteArray())
            .build()

        advertiser.startAdvertising(settings, advertiseData, object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                Log.d("BLE", "Advertising started: $data")
            }

            override fun onStartFailure(errorCode: Int) {
                Log.e("BLE", "Advertising failed: $errorCode")
            }
        })
    }

    fun startScanning(onMessageReceived: (String) -> Unit) {
        val scanFilter = ScanFilter.Builder()
            .setServiceUuid(ParcelUuid(serviceUUID))
            .build()

        val settings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()

        scanner.startScan(listOf(scanFilter), settings, object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult) {
                val data = result.scanRecord?.serviceData?.get(ParcelUuid(serviceUUID))
                data?.let {
                    val message = String(it)
                    Log.d("BLE", "Received: $message")
                    onMessageReceived(message)
                }
            }
        })
    }
}
